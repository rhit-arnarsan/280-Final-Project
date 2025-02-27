import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

import { Box, Button, TextField, FormGroup, Typography } from '@mui/material';


export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const callApi = async () => {
        const response = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            // mode: 'no-cors',
            body: JSON.stringify({"username": username, "password": password})
        }).then(i => i.json())

        if (response.error != null) {
            alert(response.error);
            return
        }

        document.cookie = "session="+response.cookie;
        console.log("here")
        
        navigate("/todos", {replace: true})
    };

    return (
        <Box>
            <FormGroup
                sx={{display: "flex", padding: "10em", rowGap: "1em", border: "1px solid", borderRadius: "5px"}}
            >
                <Typography variant="h6">Login</Typography>
                <TextField label="Username" required 
                value={username}  onChange={(e) => setUsername(e.target.value)} />
                <TextField type="password"  label="Password" required
                value={password}  onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={callApi}>Login</Button>
            </FormGroup>
            <p>Don't have an account? <Link to={{pathname: "/register"}}>Register</Link></p>
        </Box>
    );
}
