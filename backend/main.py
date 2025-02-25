#!/usr/bin/env python3

"""
Plan:

This way the forntend will not dump the entire db for every update.

so keys will be of the form:
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

"""
DB design:

"user123": {
    "settings": {
        "password": "XXXXXX",
        "lightmode": false
    },
    "1970-1-1": [
        {"task": "wash dishes", "done": false}
    ]
    ...
}


TODO hash passwords
"""

class Layer:
    def __init__(self, db_name: str):
        self.db = pickledb.PickleDB(db_name)

    def _username_valid(self, username: str) -> bool:
        return username.isalnum()

    def register(self, username: str, password: str) -> str | None:
        " returns None if no error otherwise string"

        if not self._username_valid(username):
            return f"invalid username: {username}"
        
        if self.db.get(username):
            return f"user: {username} already exists"
        
        self.db.set(username, {})

   







app = Flask(__name__)

"""
API design:


/api/login             {username: <username>, psasword: <password>}
/api/register          {username: <username>, psasword: <password>}

/api/update/<day>      [<TODOjson>, <TODOjson>]

"""

@app.route("/api/update/<day>", methods=["POST"])
def update(day):
    print(request.get_data())
    return 'abc'


# app.run(debug=True)
