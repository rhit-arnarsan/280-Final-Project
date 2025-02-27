import { useState } from 'react'

import { Checkbox, TextField } from '@mui/material';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class weekHolder {
    constructor(start, end) {
        this.startDate = start;
        this.endDate = end;
    }

    getNextWeek() {
        let newStart = new Date()
        newStart.setDate(this.startDate.getDate() + 7);
        let newEnd = new Date()
        newEnd.setDate(this.endDate.getDate() + 7);
        return new weekHolder(newStart, newEnd);
    }

}

function dayToWeek(day) {
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

function TodoLine(addLine) {
    const [done, setDone] = useState(true);
    
    const input =  (
        <TextField 
        InputProps={{ disableUnderline: true }}
        placeholder="WRITE Your TODO here"
        variant="standard"
        // value={""}
        className={done ? "strike" : ""}
        onKeyDown={ (e) => (e.key === 'Enter') ? addLine() : undefined}
        />
    );

    currDate = new Date();
    dayOfWeek = daysOfWeek[currDate.getDay()];
    month = date.getMonth() + 1; // 0-based months
    day = currDate.getDate();
    year = date.getFullYear();

    return (
        <div className="todo-item">
            <Checkbox size="small" checked={done} 
            sx={{
                '&.Mui-checked': { background: '#ffffff00', },
                padding: '3px'
            }}
            onChange={(event) => setDone(event.target.checked)} 
            />
            {input}
        </div>
    );
}

export function Day(name) {
    currDate = new Date();
    dayOfWeek = daysOfWeek[currDate.getDay()];
    month = date.getMonth() + 1; // 0-based months
    day = currDate.getDate();
    year = date.getFullYear();

    return (
        <div>
            <p>{name}</p>
            {TodoLine()}
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
export function Week(name) {
    return (
        <div className="week">
            <h1 id={name}>{name}</h1>
            {days_of_week.map((i) => Day(i))}
        </div>
    );
}