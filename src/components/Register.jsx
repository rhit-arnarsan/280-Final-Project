import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Box, TextField, FormGroup, Typography, Button } from '@mui/material';

    
export function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const callApi = async () => {

        if (password != password2) {
            alert("Passwords must match")
            return
        }

        const response = await fetch("http://127.0.0.1:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            // mode: 'no-cors',
            body: JSON.stringify({"username": username, "password": password})
        }).then(i => i.text())

        if (response.error != null) {
            alert(response.error);
            return
        }

        navigate("/login", {replace: true})
 
    };

    return (
        <Box>
            <FormGroup
                sx={{display: "flex", padding: "10em", rowGap: "1em", border: "1px solid"}}
            >
                <Typography variant="h6">Register</Typography>
                <TextField label="Username" required 
                value={username} 
                onChange={(e) => {setUsername(e.target.value)}} />
                <TextField type="password"  label="Password" required
                value={password} 
                onChange={(e) => {setPassword(e.target.value)}} />
                <TextField type="password" label="Confirm Password" 
                value={password2} 
                onChange={(e) => {setPassword2(e.target.value)}} />
                <Button onClick={callApi}>Register</Button>
            </FormGroup>
        </Box>
    );
}