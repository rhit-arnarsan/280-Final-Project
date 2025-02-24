import { useState } from 'react'

import { Checkbox, TextField } from '@mui/material';



const days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


function TodoLine() {
    const [done, setDone] = useState(false);

    const input =  (
        <TextField 
        InputProps={{ disableUnderline: true }}
        placeholder="WRITE Your TODO here"
        variant="standard"
        className={done ? "strike" : ""}
        />
    );

    return (
        <div className="fx-hr">
            <Checkbox size="small" checked={done} 
            onChange={(event) => setDone(event.target.checked)} />
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

// name is a string
export function Week(name) {
    return (
        <div className="week">
            <h1 id={name}>{name}</h1>
            {days_of_week.map((i) => Day(i))}
        </div>
    );
}