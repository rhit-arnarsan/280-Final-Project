import { useState, useEffect, useRef } from 'react'

import { Box, Button, Checkbox, TextField, Typography } from '@mui/material';

const days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class weekHolder {
    constructor(start, end) {
        this.startDate = start;
        this.endDate = end;
    }

    getNthWeekOffset(n) {
        let newStart = new Date();
        newStart.setDate(this.startDate.getDate() + 7*n);
        let newEnd = new Date();
        newEnd.setDate(this.endDate.getDate() + 7*n);
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
        return [0, 1, 2, 3, 4, 5, 6].map(
            (i) => {
                const res = new Date();
                res.setDate(this.startDate.getDate() + i)
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

    getNextWeek() {
        let newStart = new Date();
        newStart.setDate(this.startDate.getDate() + 7);
        let newEnd = new Date();
        newEnd.setDate(this.endDate.getDate() + 7);
        return new weekHolder(newStart, newEnd);
    }
}

export function dayToWeek(day) {
    let start = new Date(day);
    while (start.getDay() != 0) {
        start.setDate(start.getDate() - 1);
    }

    let end = new Date()
    end.setDate(start.getDate() + 7)
    return new weekHolder(start, end);
}

export async function updateDay(day, data) {
    const x = await fetch("http://localhost:5000/api/update-day", {
        body: JSON.stringify({day: day, todos: data}),
        credentials: 'include',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    }).then((i) => i.json());
    if (x.error != null) alert(x.error)
    return x;
}

export async function getDay(day) {
    const x = await fetch("http://localhost:5000/api/get-day", {
        body: JSON.stringify({day: day}),
        credentials: 'include',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    }).then((i) => i.json());
    if (x.error != null) alert(x.error)
    return x;
}


export function Day(name, day) {
    // day is of type date

    let [complete, setComplete] = useState([{text: "", finished: false}])
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            const x = async() => {
                setComplete((await getDay(day.toISOString().slice(0, 10))).data)
            }
            x()
        } else {
            const x = async () => {
                await updateDay(day.toISOString().slice(0, 10), complete)
                console.log(complete)
            }
            x()
        }
    }, [complete])
    function toItem(index, task, done) {
        return (
            <Box className="todo-item">
                <Checkbox size="small" checked={done}
                    sx={{
                        '&.Mui-checked': { background: '#ffffff00', },
                        padding: '3px'
                    }}
                    onClick={(event) => {
                        setComplete(
                            complete.map((c, i) => {
                                return (i == index) ? {finished: event.target.checked, text:c.text}: c
                            })
                        )
                    }}
                />
                <TextField
                    InputProps={{ disableUnderline: true }}
                    placeholder="WRITE Your TODO here"
                    variant="standard"
                    value={task}
                    className={done ? "strike" : ""}
                    onChange={(e) => {
                        setComplete(
                            complete.map((c, i) => {
                                return (i == index) ? {finished: c.finished, text:e.target.value}: c
                            })
                        )
                    }}
                    // onKeyDown={(e) => (e.key === 'Enter') ? addLine(index) : undefined}
                />
                <Button
                    onClick={() => {
                        setComplete(complete.filter((_, i) => index !== i))
                    }}>
                    Delete
                </Button>
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "180%"}}>
                <Typography>
                    {name}:
                </Typography>
                <Button onClick={() => setComplete([...complete, {finished: false, text: ""}])}>Add</Button>
            </Box>
            {complete.map((x, i) => toItem(i, x.text, x.finished))}
        </Box>
    )
}


export function Week(name, weekHolder) {
    // weekHolder.getData();
    return (
        <div className="week">
            <hr />
            <h1 id={name}>{name}</h1>
            {weekHolder.toListOfDays().map((day, i) => Day(days_of_week[i], day))}
        </div>
    );
}