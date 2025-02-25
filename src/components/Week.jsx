import { useState } from 'react'

import { Checkbox, TextField } from '@mui/material';



const days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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