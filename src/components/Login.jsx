// import { useState } from 'react';

import { Box, TextField, FormGroup, Typography } from '@mui/material';


export function Login() {
    return (
        <Box>
            <FormGroup
                sx={{display: "flex", padding: "10em", rowGap: "1em"}}
            >
                <Typography variant="h6">Login</Typography>
                <TextField label="Username" required></TextField>
                <TextField label="Password" required></TextField>
            </FormGroup>
        </Box>
    );
}