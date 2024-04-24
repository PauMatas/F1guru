import ast
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import PlainTextResponse

from f1guru import F1GuruChain, MockUpChain
from f1guru.database import run_query

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    print(f"{repr(exec)}")
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


@app.get("/api/answer")
def answer(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Missing question")

    try:
        return {"answer": F1GuruChain().answer_question(q)}
    except Exception as e:  # TODO: Catch specific exception for problems with the chain
        raise HTTPException(status_code=404, detail="System is not capable to answer this question.") from e


@app.get("/api/answer/mockup")
def answer_mockup(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Missing question")

    return {"answer": MockUpChain().answer_question(q)}


@app.get("/api/last_update")
def last_update():
    year, round_ = os.environ["LAST_F1DB_RELEASE"].split(".")
    last_gp_name = run_query(
        f"SELECT short_name FROM race LEFT JOIN grand_prix gp ON grand_prix_id = gp.id WHERE year = {year} AND round = {round_}"
    )
    return {"lastUpdate": f"{ast.literal_eval(last_gp_name)[0][0]} {year}"}
