from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

from f1guru.database import get_schema


class F1GuruChain:
    def __init__(self):
        self.llm = ChatOpenAI()

        # Define the Natural Language question to SQL query chain
        template_sql = """Based on the table schema below, write a SQL query that would answer the user's question:
{schema}
Question: {question}
SQL Query:"""
        prompt_sql = ChatPromptTemplate.from_template(template_sql)
        self.sql_chain = (
            RunnablePassthrough.assign(schema=get_schema)
            | prompt_sql
            | self.llm.bind(stop=["\nSQLResult:"])
            | StrOutputParser()
        )

        # Define the Natural Language question to Natural Language response chain
        template_response = """Based on the table schema below, question, sql query, and sql response, write a natural language response:
{schema}

Question: {question}
SQL Query: {query}
SQL Response: {response}"""
        prompt_response = ChatPromptTemplate.from_template(template_response)
        self.response_chain = (
            RunnablePassthrough.assign(query=self.sql_chain).assign(
                schema=get_schema,
                response=lambda vars: self.natural_language_to_sql(vars["query"]),
            )
            | prompt_response
            | self.llm
            | StrOutputParser()
        )

    def natural_language_to_sql(self, question: str) -> str:
        return self.sql_chain.run(question)

    def answer_question(self, question: str) -> str:
        return self.response_chain.invoke({"question": question})
