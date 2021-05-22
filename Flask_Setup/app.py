from flask import Flask, render_template, jsonify
import os.path
import pandas as pd
import requests as r
from flask_pymongo import PyMongo
import sqlalchemy

engine=sqlalchemy.create_engine('sqlite:///data.db')

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

@app.route("/data")
def jsonified():
    
    


if __name__ == "__main__":
    app.run(debug=True)
    