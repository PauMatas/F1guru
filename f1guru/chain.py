"""
This module defines the F1GuruChain class that chains together the OpenAI language model with the
F1Guru database. 
"""

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

from f1guru.database import get_schema, run_query


class F1GuruChain:
    """
    A class that chains together the OpenAI language model with the F1Guru database allowing for
    natural language queries to the database and responses to be generated from the database query
    results.
    """

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
                response=lambda vars: run_query(vars["query"]),
            )
            | prompt_response
            | self.llm
            | StrOutputParser()
        )

    def natural_language_to_sql(self, question: str) -> str:
        """
        Convert a natural language question to a SQL query for the F1DB database.
        """
        return self.sql_chain.invoke({"question": question})

    def answer_question(self, question: str) -> str:
        """
        Answer a natural language question using a query to the F1DB database.
        """
        return self.response_chain.invoke({"question": question})
