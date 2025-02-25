#!/usr/bin/env python3

"""
Plan:

This way the forntend will not dump the entire db for every update.

so keys will be of the form:
"""

import json

class Todo:
    def __init__(self, text: str, done: bool, level: int):
        self.text = text
        self.done = done
        self.level = level

    def toJSON(self):
        return json.dumps({
            "text": self.text,
            "done": self.done,
            "level": self.level
        })
    
    def fromJSON(input):
        got = json.loads(input)
        return Todo(
            got["text"],
            got["done"],
            got["level"],
        )
        
        



Day = list[Todo]


import pickledb
from flask import Flask, request
from datetime import date



# Open DB

"""
DB design:

"user123": {
    "secret": {
        "password": "XXXX"
    },
    "settings": {
        "lightmode": false
    },
    "1970-1-1": [
        {"task": "wash dishes", "done": false}
    ]
    ...
}


TODO hash passwords
"""

class NoSuchUser(Exception):
    pass


class Layer:
    def __init__(self, db_name: str):
        self.db = pickledb.PickleDB(db_name)

    def username_valid(self, username: str) -> bool:
        return username.isalnum()
    
    def user_exists(self, username: str) -> bool:
        return self.db.get(username) != None
    
    def get_user(self, username: str) -> dict:
        if not self.user_exists(username):
            return NoSuchUser(username)
        return self.db.get(username)
    
    def user_settings(self, username: str) -> dict:
        return self.get_user(username)["settings"]
    
    def user_secret(self, username: str) -> dict:
        return self.get_user(username)["secret"]

    def register(self, username: str, password: str) -> str | None:
        " returns None if no error otherwise string"

        if not self.username_valid(username):
            return f"invalid username: {username}"

        if self.user_exists(username):
            return f"user: {username} already exists"
        
        success = self.db.set(username, {
            "settings": {
                "lightmode": True
            },
            "secret": {
                "password": password
            }
        })
        return None if success else "Failed to write to DB"
    
    def login(self, username: str, password: str) -> str | None:
        # always same error message for security or smth
        error = "username or password wrong"

        try:
            self.user_secret(username)["password"] = password
        except Exception:
            return error

        return None

    def update_data(self, username: str, day: str, data: str) -> str | None:
        " returns None if no error otherwise string"
        user = self.get_user(username)
        try:
            formatted_day = date.fromisoformat(day).isoformat()
        except Exception:
            return f"Invalid day: \"{day}\""
        
        try:
            todo = Todo.fromJSON(data)
        except Exception:
            return f"Invalid TODO data"

        user[formatted_day] = todo.toJSON()

        return None

        
        
        








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
