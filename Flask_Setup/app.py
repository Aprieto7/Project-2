from flask import Flask, render_template, jsonify
import os.path
import pandas as pd
import requests as r
import sqlalchemy

#create the engine
engine = sqlalchemy.create_engine('sqlite:///../data/covid.db')

# create the flask app
app = Flask(__name__)

# create the home route
@app.route("/")
def home():

    return render_template("index.html")

# create the first route for the historical data
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

# create the second route for the most recent data
@app.route("/stateData")
def jsonified2():
    rows = engine.execute("SELECT state, cases, deaths, positiveTests, newCases, vaccinesDistributed, vaccinationsInitiated, vaccinationsCompleted, vaccinesAdministered, lat, long, population FROM states_totals_table" )
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
            "long": row[10],
            "population": row[11]
            }
        states.append(x)
    return jsonify(states)

# create the route for the map
@app.route("/map")
def map():

    # # Return template and data
    return render_template("map.html")

if __name__ == "__main__":
    app.run(debug=True)
