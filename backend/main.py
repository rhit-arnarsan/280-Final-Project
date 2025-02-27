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
    
    def fromDict(input: dict):
        return Todo(
            input["text"],
            input["done"],
            input["level"],
        )
    
    def fromJSON(input: str):
        got = json.loads(input)
        return Todo.fromDict(got)
 
    def toJSON(self):
        return json.dumps({
            "text": self.text,
            "done": self.done,
            "level": self.level
        })       
        



Day = list[Todo]


import pickledb
from datetime import date, datetime, timedelta

import random
import base64

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
....


"__sessions__": {
    <cookie>: {
        "username": <username>,
        "expires": <datetime isoformat>
    }
}

"""

class NoSuchUser(Exception):
    pass

class SessionExpired(Exception):
    pass


class Layer:
    SPECIAL_KEYS = {"settings", "secret"}

    def __init__(self, db_name: str):
        self.db = pickledb.PickleDB(db_name)
        self.db["__sessions__"]  = {}

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
                "password": password,
            }
        })
        return None if success else "Failed to write to DB"

    def remove_all_sessions(self, for_user: str):
        sessions = self.db.get("__sessions__")
        cpy = {k:v for k, v in sessions.items() if v["username"] != for_user}
        sessions.clear()
        sessions.update(cpy)

    def _add_session(self, for_user: str, invalidate_other_user_sessions: bool = True, lasts: timedelta = timedelta(hours=1)) -> str:
        sessions = self.db.get("__sessions__")
        if invalidate_other_user_sessions:
            self.remove_all_sessions(for_user)

        cookie = base64.b64encode(random.randbytes(64)).decode("utf-8")

        sessions[cookie] = {
            "username": for_user,
            "expires": (datetime.now() + lasts).isoformat()
        }
        return cookie

    def use_session(self, cookie: str) -> str:
        " returns username of the owner of the session, only if it is expired "
        sessions = self.db.get("__sessions__")
        if cookie not in sessions:
            raise SessionExpired("No session: " + cookie)
        
        session_data = sessions[cookie]
        if "expires" not in session_data or datetime.now() >= datetime.fromisoformat(session_data["expires"]):
            return SessionExpired("Expired: " + cookie)
        return session_data["username"]

    def login(self, username: str, password: str) -> str | None:
        # returns cookie or None for error

        try:
            self.user_secret(username)["password"] = password
        except Exception:
            return None

        # create session
        return self._add_session(username)

    def update_day(self, username: str, day: str, data: list[Todo]) -> str | None:
        " returns None if no error otherwise string"
        user = self.get_user(username)
        try:
            formatted_day = date.fromisoformat(day).isoformat()
        except Exception:
            return f"Invalid day: \"{day}\""

        user[formatted_day] = data
        return None

    def get_day(self, username: str, day: str) -> Todo:
        try:
            formatted_day = date.fromisoformat(day).isoformat()
        except Exception:
            return f"Invalid day: \"{day}\""
        
        try:
            todo = Todo.fromJSON(self.get_user(username)[formatted_day])
        except NoSuchUser as nsu:
            raise nsu
        except Exception:
            return f"Invalid TODO data"
        return todo
    
    def get_all_days(self, username: str) -> dict[date, Todo]:
        result = {}
        for k, v in self.get_user(username):
            if k in Layer.SPECIAL_KEYS:
                continue
            result[date.fromisoformat(k)] = Todo.fromDict(v)
        return result
    
"""
API design:

====== Login Related ======
/api/login             {username: <username>, psasword: <password>}
/api/register          {username: <username>, psasword: <password>}
/api/logout            {} // uses the users' cookie to identify who is logging out and clears their session from the backend

====== General ======
These generally don't take in a username as things are validated by the users'
cookie which serves as the user identifier

=== Core feature ===
/api/update-day        {day: <date>, todos: [<TODOjson>, <TODOjson>]} -> {error: null}
/api/get-day           {day: <date>} -> {error: null, data: <todo.toJSON()>}
/api/get-days-inrange  {start: <date>, end: <date>} -> {error: null, data: {<date>: <todo.toJSON(), ...>}} // [start, end) inclusivity

=== Secondary Feature ===
/api/get-settings      {}
/api/update-settings      {<updated-field>: <new-value>, ...}

"""

import flask
import flask_cors
from flask import Flask, request




layer = Layer("temp.db")
app = Flask(
    __name__,
    static_url_path='/', # correct
    static_folder='dist/')

def get_session():
    if "session" in request.cookies:
        return request.cookies["session"]
    raise Exception("adsf")

def quick_response(a):
    response = flask.Response(a)
    # response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Content-Type', 'application/json')
    response.headers.add('Accept', 'application/json')
    return response

def error(msg: str | None, other_info: dict = {}):
    if not isinstance(other_info, dict):
        other_info = {}
    if "error" in other_info:
        return quick_response(json.dumps({"error":f"response contained invalid error param: {other_info}"}))
    result = other_info.copy()
    result["error"] = msg
    return quick_response(json.dumps(result))

def noerror(other_info: dict = {}):
    return error(None, other_info)

"""
====== Login Related ======
"""

@app.route("/api/login", methods=["POST"])
@flask_cors.cross_origin()
def login():
    j = request.json
    res = layer.login(j["username"], j["password"])
    if res == None:
        return error("wrong username or password")
    return noerror({"cookie": res})

@app.route("/api/register", methods=["POST"])
@flask_cors.cross_origin()
def register():
    j = json.loads(request.get_data())
    res = layer.register(j["username"], j["password"])
    if res != None:
        return error(res)
    return noerror()

@app.route("/api/logout", methods=["POST"])
@flask_cors.cross_origin()
def logout():
    try:
        whoami = layer.use_session(get_session())
        layer.remove_all_sessions(whoami)
        return noerror()
    except Exception:
        return noerror()

"""
====== Core feature ======
"""
@app.route("/api/update-day", methods=["POST"])
@flask_cors.cross_origin()
def update_day():
    whoami = layer.use_session(get_session())
    d = date.fromisoformat(request.json["day"])
    todos = [Todo.fromDict(i) for i in request.json["todos"]]
    layer.update_day(whoami, d, todos)
    return noerror()

@app.route("/api/get-day", methods=["POST"])
@flask_cors.cross_origin()
def get_day():
    whoami = layer.use_session(get_session())
    d = date.fromisoformat(request.json["day"])
    result = layer.get_day(whoami, d)
    return noerror({"data": result})

@app.route("/api/get-day-inrange", methods=["POST"])
@flask_cors.cross_origin()
def get_data_in_range():
    whoami = layer.use_session(get_session())
    start = date.fromisoformat(request.json["start"])
    end   = date.fromisoformat(request.json["end"])
    result = {k:v for k, v in layer.get_all_days(whoami).items() if start <= k < end}
    return noerror({"data": result})

"""
====== Secondary Feature ======
"""
@app.route("/api/get-settings", methods=["POST"])
@flask_cors.cross_origin()
def get_settings():
    whoami = layer.use_session(get_session())
    layer.user_settings(whoami)
    return noerror({"data": layer})

@app.route("/api/update-settings", methods=["POST"])
@flask_cors.cross_origin()
def update_settings():
    whoami = layer.use_session(get_session())
    assert("error" not in request.json)
    layer.user_settings(whoami).update(request.json)
    return noerror()


@app.route("/<any>", methods=["GET"])
@flask_cors.cross_origin()
def serve_files(any):
    return open("dist/index.html").read()





app.run(debug=True)
