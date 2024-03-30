import pymysql
import requests
import os
from os.path import join, dirname
import zipfile
from langchain_community.utilities import SQLDatabase
from dotenv import load_dotenv

load_dotenv()


def get_db() -> SQLDatabase:
    tidb_connection_string = f"mysql+pymysql://{os.environ.get('TIDB_USER')}:{os.environ.get('TIDB_PASSWORD')}@{os.environ.get('TIDB_HOST')}:{os.environ.get('TIDB_PORT')}/{os.environ.get('TIDB_DB_NAME')}?ssl_ca=/etc/ssl/cert.pem&ssl_verify_cert=true&ssl_verify_identity=true"
    db = SQLDatabase.from_uri(tidb_connection_string)
    return db


def get_db_connection() -> pymysql.connections.Connection:
    return pymysql.connect(
        host=os.environ.get("TIDB_HOST"),
        port=os.environ.get("TIDB_PORT"),
        user=os.environ.get("TIDB_USER"),
        password=os.environ.get("TIDB_PASSWORD"),
        database=os.environ.get("TIDB_DB_NAME"),
        ssl_ca="/etc/ssl/cert.pem",
        ssl_verify_cert=True,
        ssl_verify_identity=True,
    )


def run_query(query: str) -> str:
    db = get_db()
    return db.run(query)


def get_schema(_) -> str:
    db = get_db()
    schema = db.get_table_info()
    return schema


def check_for_new_release() -> None:
    owner = "f1db"
    repo = "f1db"
    url = f"https://api.github.com/repos/{owner}/{repo}/releases/latest"
    headers = {"Authorization": f"token {os.environ.get('GITHUB_TOKEN')}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        latest_release = response.json()
        if os.environ.get("LAST_F1DB_RELEASE") != latest_release["tag_name"]:
            download_files_from_release(latest_release)
            os.environ["LAST_F1DB_RELEASE"] = latest_release["tag_name"]


def download_files_from_release(release_info: dict) -> None:
    assets = release_info["assets"]
    asset = filter(lambda x: x["name"] == "f1db-sql-mysql.zip", assets)
    if asset and len(asset) == 1:
        zip_file_path = download_file(asset[0]["browser_download_url"])
        with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
            zip_ref.extractall(join(dirname(__file__), "temp"))

        update_database(join(dirname(__file__), "temp", "f1db-sql-mysql.sql"))

        for file in os.listdir(join(dirname(__file__), "temp")):
            os.remove(join(dirname(__file__), "temp", file))
    elif asset:
        raise ValueError("Multiple assets found with the same name")


def download_file(url: str) -> str:
    response = requests.get(url)
    if response.status_code == 200:
        filename = join(dirname(__file__), "temp", url.split("/")[-1])
        with open(filename, "wb") as f:
            f.write(response.content)
        return filename


def update_database(sql_file_path: str) -> None:
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        with open(sql_file_path, "r") as f:
            sql_script = f.read()

        cursor.execute(sql_script)
        connection.commit()
    except pymysql.Error as e:
        raise e
    finally:
        if "connection" in locals() and connection.is_connected():
            cursor.close()
            connection.close()
