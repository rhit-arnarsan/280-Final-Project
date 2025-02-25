#!/usr/bin/env python3

"""
Plan:
I did some research and pickledb is a key value store.
This means a nice clean nested json style storage is the wrong approach.
Although for this application it proably does not matter

This way the forntend will not dump the entire db for every update either

so keys will be of the form:

Angle brackets not included

basically we store each day
<YYYY-mm-dd> = list[Todo]


"""

import json

class Todo:
    def __init__(self, text: str, done: bool, level: int):
        self.done = done
        self.text = text
        self.level = level

    def toJSON(self):
        return json.dumps({
            "text": self.text,
            "done": self.done,
            "level": self.level
        })

Day = list[Todo]


import pickledb
from flask import Flask, request
from datetime import date



# Open DB
db = pickledb.PickleDB("todos.db")


def setDay(day: str, value: Day):
    real_day = date.fromisoformat(day)
    key = real_day.isoformat()
    db.set(key) = 

    










app = Flask(__name__)

"""
API design:

"""

@app.route("/api/update/<day>", methods=["POST"])
def update():
    print(request.get_data())
    return 'abc'


app.run(debug=True)
