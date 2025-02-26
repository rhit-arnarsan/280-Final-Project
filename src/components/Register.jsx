import { useState } from 'react';

import { Box, TextField, FormGroup, Typography, Button } from '@mui/material';

    
export function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const callApi = () => {

    };

    return (
        <Box>
            <FormGroup
                sx={{display: "flex", padding: "10em", rowGap: "1em", border: "1px solid"}}
            >
                <Typography variant="h6">Register</Typography>
                <TextField label="Username" required></TextField>
                <TextField type="password"  label="Password" value={username} onChange={(e) => {setUsername(e.target.value); console.log(username)}} required />
                <TextField type="password" label="Confirm Password" value={password} required />
                <Button>Register</Button>
            </FormGroup>
        </Box>
    );
}