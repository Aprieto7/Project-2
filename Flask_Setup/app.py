from flask import Flask, render_template, jsonify
import os.path
import pandas as pd
import requests as r
from flask_pymongo import PyMongo
import sqlalchemy

engine = sqlalchemy.create_engine('sqlite:///../data/covid.db')
# df1 = pd.read_sql_table(sqlite_table1)
# df2 = pd.read_sql_table(sqlite_table2)
# df1.to_sql("historical", index=False, con=engine)
# df2.to_sql("states", index=False, con=engine)

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection


# mongo = PyMongo(app, uri="mongodb://localhost:27017/app_name")

# Route to render index.html template using data from Mongo


@app.route("/")
def home():

    # # Find one record of data from the mongo database

    # # Return template and data
    return render_template("index.html")


@app.route("/historicalData")
def jsonified1():

    rows = engine.execute(
        "SELECT date, state, cases, deaths, newCases, vaccinesAdministered FROM hist_vaccine_table")
    historical = []
    for row in rows:
        x = {"date": row[0],
            "state": row[1],
             "cases": row[2],
             "deaths": row[3],
             "newCases": row[4],
             "vaccinesAdministered": row[5]
             }
        historical.append(x)
    return jsonify(historical)
    
@app.route("/stateData")
def jsonified2():
    rows = engine.execute("SELECT state, cases, deaths, positiveTests, newCases, vaccinesDistributed, vaccinationsInitiated, vaccinationsCompleted, vaccinesAdministered, lat, long FROM states_totals_table" )
    states = []
    for row in rows:
        x = {"state": row[0],
            "cases": row[1],
            "deaths": row[2],
            "positiveTests": row[3],
            "newCases": row[4],
            "vaccinesDistributed": row[5],
            "vaccinationsInitiated": row[6],
            "vaccinationsCompleted": row[7],
            "vaccinesAdministered": row[8],
            "lat": row[9],
            "long": row[10]
            }
        states.append(x)
    return jsonify(states)

if __name__ == "__main__":
    app.run(debug=True)
