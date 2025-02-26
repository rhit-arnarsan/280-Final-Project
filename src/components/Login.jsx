import { Link } from 'react-router';

import { Box, Button, TextField, FormGroup, Typography } from '@mui/material';


export function Login() {
    return (
        <Box>
            <FormGroup
                sx={{display: "flex", padding: "10em", rowGap: "1em", border: "1px solid"}}
            >
                <Typography variant="h6">Login</Typography>
                <TextField label="Username" required></TextField>
                <TextField type="password"  label="Password" required></TextField>
                <Button>Login</Button>
            </FormGroup>
            <p>Don't have an account? <Link to={{pathname: "/register"}}>Register</Link></p>
        </Box>
    );
}