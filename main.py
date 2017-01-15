# from venv/lib/flask import Flask
# from flask-ask import Ask, statement

from flask import Flask
from flask_ask import Ask, statement

app = Flask(__name__)
ask = Ask(app, "/")

@ask.intent("HelloIntent")
def hello():
    return statement("Success")