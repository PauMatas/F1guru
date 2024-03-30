from fastapi import FastAPI, HTTPException
from f1guru import F1GuruChain, MockUpChain

app = FastAPI()


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


@app.get("/api/answer")
def answer(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Missing question")

    try:
        return {"answer": F1GuruChain().answer_question(q)}
    except Exception as e:  # TODO: Catch specific exception for problems with the chain
        raise HTTPException(
            status_code=404, detail="System is not capable to answer this question."
        ) from e


@app.get("/api/answer/mockup")
def answer_mockup(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Missing question")

    response = {"answer": MockUpChain().answer_question(q)}
    print(response)
    return response
