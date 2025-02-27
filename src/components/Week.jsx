import { useState } from 'react'

import { Button, Checkbox, TextField } from '@mui/material';

const days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class weekHolder {
    constructor(start, end) {
        this.startDate = start;
        this.endDate = end;
    }

    getNextWeek() {
        let newStart = new Date();
        newStart.setDate(this.startDate.getDate() + 7);
        let newEnd = new Date();
        newEnd.setDate(this.endDate.getDate() + 7);
        return new weekHolder(newStart, newEnd);
    }

    getNextNWeeks(n) {
        let weeks = [this]

        for (let i = 1; i < n + 1; i++) {
            weeks[i] = this.getNextWeek(weeks[i - 1])
        }

        weeks.shift()
        console.log(weeks);
        return weeks
    }

    toListOfDays() {
        return [0,1,2,3,4,5,6,7].map(
            (i) => {
                const res = new Date();
                res.setDate(this.startDate.getDate()+ i)
                return res;
            }
        )
    }

    async getData() {
        const x = await fetch("http://localhost:5000/api/get-days-inrange", {
            body: JSON.stringify({
                start: this.startDate.toISOString().slice(0, 10),
                end: this.endDate.toISOString().slice(0, 10),
            }),
            credentials: 'include',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }

        }).then((i) => i.json());
        console.log(x);
        return x;
    }

}

export function dayToWeek(day) {
    let start = new Date(day);
    while (start.getDay() != 0) {
        start.setDate(start.getDate() - 1);
    }

    let end =  new Date()
    end.setDate(start.getDate() + 7)
    return new weekHolder(start, end);
}

console.log(dayToWeek(new Date()) )
console.log(dayToWeek(new Date()).getNextWeek())
console.log(dayToWeek(new Date()).getNextNWeeks(9));
console.log(dayToWeek(new Date()).toListOfDays())


function TodoLine(index, addLine, valueDefault, doneDefault, passUp, remove) {
    const [val, setVal] = useState(valueDefault);
    const [done, setDone] = useState(doneDefault);
    
    const input =  (
        <TextField 
        InputProps={{ disableUnderline: true }}
        placeholder="WRITE Your TODO here"
        variant="standard"
        value={val}
        className={done ? "strike" : ""}
        onChange={(e) => {
            setVal(e.target.value);
            passUp(index, e.target.value, done)
        }}
        onKeyDown={ (e) => (e.key === 'Enter') ? addLine(index) : undefined}
        />

    );

    return (
        <div className="todo-item">
            <Checkbox size="small" checked={done} 
            sx={{
                '&.Mui-checked': { background: '#ffffff00', },
                padding: '3px'
            }}
            onChange={(event) => {
                setDone(event.target.checked)
                passUp(index, val, event.target.checked)
            }}
            />
            {input}
            <Button
            onClick={() => remove(index)}>
                Delete
            </Button>
        </div>
    );
}

export function Day(name, date) {
    const [todos, setTodos] = useState([{value: "", done: false}]) //[...existing, {value: "", done: false}])

    const sT = (x) => {
        if (typeof x != "object") {
            console.trace("asdf")
            console.log("x ", x)
        }
        setTodos(x)
    }
    const update = (i, value, done) => {
        sT((x) => window.structuredClone(x).map((todo, index) => {
            return (i == index) ? {value: value, done: done} : todo
        }))
        console.log(name, todos)
    };

    const remove = async (i) => {
        
        // sT((x) => x.filter((_, index) => index !== i));
        const temp = window.structuredClone(todos).filter((_, index) => index != i)
        console.log("temp")
        sT(temp);
        // const got = [...todos.slice(0, i), ...todos.slice(i)];
    }

    const add = (i) => {
        sT([...todos.slice(0, i+1), {value: "", done: false}, ...todos.slice(i)]);
        // const got = [...todos.slice(0, i), ...todos.slice(i)];
    }

    return (
        <div>
            <p alt={date.toISOString().slice(0,10)}>{name}</p>
            {
                todos.map((todo, i) => 
                    TodoLine(i, add, todo.value, todo.done, update, remove)) 
            }
        </div>
    );
}

// format will be
/*
{
    "monday": [
        {
            "task": "<task here>",
            "done": false | true
        }
    ],
    "tuesday": ...
}
*/


// name is a string
export function Week(name, weekHolder) {
    weekHolder.getData();
    return (
        <div className="week">
            <h1 id={name}>{name}</h1>
            {/* {weekHolder.toListOfDays().map((day, i) => Day(days_of_week[i], day, [{value:"asdf", done: true}]))} */}
            {Day("TestDay", new Date(), [{value: "asdf", done: true}])}
        </div>
    );
}