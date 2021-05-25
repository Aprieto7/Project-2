from flask import Flask, render_template, jsonify
import os.path
import pandas as pd
import requests as r
from flask_pymongo import PyMongo
import sqlalchemy

engine = sqlalchemy.create_engine('sqlite:///covid.db')
df1 = pd.read_sql_table(sqlite_table1)
df2 = pd.read_sql_table(sqlite_table2)
df1.to_sql("historical", index=False, con=engine)
df2.to_sql("states", index=False, con=engine)

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection


mongo = PyMongo(app, uri="mongodb://localhost:27017/app_name")

# Route to render index.html template using data from Mongo


@app.route("/")
def home():

    # # Find one record of data from the mongo database

    # # Return template and data
    return render_template("index.html")


@app.route("/historicalData")
def jsonified():

    rows = engine.execute(
        "SELECT date, cases, deaths, newCases, vaccinesAdministered FROM historical")
    historical = []
    for row in rows:
        x = {"date": row[1],
             "cases": row[2],
             "deaths": row[3],
             "newCases": row[4],
             "vaccinesAdministered": [5]
             }
        historical.append(x)
    return jsonify(historical)
    
@app.route("/stateData")
def jsonified():
    rows = engine.execute("SELECT state, cases, deaths, positiveTests, newCases, vaccinesDistributed, vaccinationsInitiated, vaccinationsCompleted, vaccinesAdministered, lat, long")
    states = []
    for row in rows:
        x = {"state": row[1],
            "cases": row[2],
            "deaths": row[3],
            "positiveTests": row[4],
            "newCases": row[5],
            "vaccinesDistributed": row[6],
            "vaccinationsInitiated": row[7],
            "vaccinationsCompleted": row[8],
            "vaccinesAdministered": row[9],
            "lat": row[10],
            "long": row[11]
            }
        states.append(x)
    return jsonify(states)

if __name__ == "__main__":
    app.run(debug=True)
