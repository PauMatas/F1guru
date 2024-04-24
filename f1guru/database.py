"""This module provides functions to interact with the F1DB database."""

import subprocess
from typing import Any, Dict, Sequence
import pymysql
import requests
import os
from os.path import join, dirname
import zipfile
from langchain_community.utilities.sql_database import SQLDatabase
from dotenv import load_dotenv
from sqlalchemy import Result

load_dotenv()


def get_db() -> SQLDatabase:
    """Get a SQLAlchemy database wrapper for the F1DB database."""
    user = os.environ.get("F1DB_USER")
    password = os.environ.get("F1DB_PASSWORD")
    host = os.environ.get("F1DB_HOST")
    port = os.environ.get("F1DB_PORT")
    db_name = os.environ.get("F1DB_DB_NAME")

    tidb_connection_string = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db_name}?ssl_ca=/etc/ssl/cert.pem&ssl_verify_cert=true&ssl_verify_identity=true"
    db = SQLDatabase.from_uri(tidb_connection_string)

    return db


def run_query(query: str) -> str | Sequence[Dict[str, Any]] | Result[Any]:
    """Run a query on the F1DB database and return the results."""
    db = get_db()
    return db.run(query)


def get_schema(_) -> str:
    """Get the schema of the F1DB database."""
    db = get_db()
    schema = db.get_table_info()
    return schema


def check_for_new_release() -> None:
    """
    Check for a new release of the F1DB database on GitHub. If a new release is found, download the
    database files and rebuild the database.
    """
    owner = "f1db"
    repo = "f1db"
    url = f"https://api.github.com/repos/{owner}/{repo}/releases/latest"
    headers = {"Authorization": f"token {os.environ.get('GITHUB_TOKEN')}"}
    response = requests.get(url, headers=headers, timeout=30)
    if response.status_code == 200:
        latest_release = response.json()
        if os.environ.get("LAST_F1DB_RELEASE") != latest_release["tag_name"]:
            print(
                f"New release found. Rebuilding database from release {os.environ.get('LAST_F1DB_RELEASE')} to {latest_release['tag_name']}..."
            )
            rebuild_db_from_release(latest_release)
            os.environ["LAST_F1DB_RELEASE"] = latest_release["tag_name"]


def rebuild_db_from_release(release_info: dict) -> None:
    """
    Download the database files from the release info of the F1DB database on GitHub and rebuild
    the database.
    """
    assets = release_info["assets"]
    asset = list(filter(lambda x: x["name"] == "f1db-sql-mysql.zip", assets))
    if asset and len(asset) == 1:
        zip_file_path = download_file(asset[0]["browser_download_url"])
        with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
            zip_ref.extractall(join(dirname(__file__), "temp"))

        update_database(join(dirname(__file__), "temp", "f1db-sql-mysql.sql"))

        for file in os.listdir(join(dirname(__file__), "temp")):
            if file != ".gitkeep":
                os.remove(join(dirname(__file__), "temp", file))
    elif len(asset) > 1:
        raise ValueError("Multiple assets found with the same name")
    else:
        raise ValueError("No asset found with the name f1db-sql-mysql.zip")


def download_file(url: str) -> str:
    """Download a file from a URL and return the file path."""
    response = requests.get(url, timeout=30)
    if response.status_code == 200:
        filename = join(dirname(__file__), "temp", url.split("/")[-1])
        with open(filename, "wb") as f:
            f.write(response.content)
        return filename
    raise ValueError("Failed to download file")


def update_database(sql_file_path: str) -> None:
    """Update the F1DB database with the SQL file at the given path."""
    # mysql -h {os.environ.get("F1DB_HOST")} -P {os.environ.get("F1DB_PORT")} -u {os.environ.get("F1DB_USER")} -p{os.environ.get("F1DB_PASSWORD")} {os.environ.get("F1DB_DB_NAME")} < {sql_file_path}
    command = f"""mysql -h {os.environ.get("F1DB_HOST")} -P {os.environ.get("F1DB_PORT")} -u {os.environ.get("F1DB_USER")} -p{os.environ.get('F1DB_PASSWORD')} {os.environ.get("F1DB_DB_NAME")} < {sql_file_path}"""

    subprocess.run(command, shell=True)
