import ast
import os
from flask import Flask, jsonify, request, abort
from f1guru import F1GuruChain, MockUpChain
from f1guru.database import run_query

app = Flask(__name__)


@app.route("/api/answer", methods=["GET"])
def answer():
    q = request.args.get("q")
    if not q:
        abort(400, description="Missing question")

    try:
        answer_result = F1GuruChain().answer_question(q)
        return jsonify({"answer": answer_result})
    except Exception as e:
        abort(
            404, description="System is not capable to answer this question."
        )  # Handle specific exceptions


@app.route("/api/answer/mockup", methods=["GET"])
def answer_mockup():
    q = request.args.get("q")
    if not q:
        abort(400, description="Missing question")

    answer_result = MockUpChain().answer_question(q)
    return jsonify({"answer": answer_result})


@app.route("/api/last_update", methods=["GET"])
def last_update():
    # Retrieve the latest F1DB release details
    year, round_, _ = os.environ["LAST_F1DB_RELEASE"][1:].split(".")
    last_gp_name = run_query(
        f"SELECT short_name FROM race LEFT JOIN grand_prix gp ON grand_prix_id = gp.id WHERE year = {year} AND round = {round_}"
    )
    last_gp_name_parsed = ast.literal_eval(last_gp_name)
    last_update_info = f"{last_gp_name_parsed[0][0]} {year}"

    return jsonify({"lastUpdate": last_update_info})


# # Run the Flask application if executed directly
# if __name__ == "__main__":
#     app.run(debug=True)
