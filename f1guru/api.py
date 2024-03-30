from fastapi import FastAPI, HTTPException
from f1guru import F1GuruChain

app = FastAPI()


@app.get("/answer", methods=["GET"])
def answer(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Missing question")

    try:
        return {"answer": F1GuruChain().answer_question(q)}
    except Exception as e:  # TODO: Catch specific exception for problems with the chain
        raise HTTPException(
            status_code=404, detail="System is not capable to answer this question."
        )


@app.get("/answer/mockup", methods=["GET"])
def answer_mockup(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Missing question")

    return {
        "answer": "Fernando is faster than you. Can you confirm you understood this message?"
    }
