import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';

export function TopBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const openAccountMenu = (event) => {
        setMenuOpen(!menuOpen);
        setMenuAnchor(event.currentTarget)
    }

    const logout = async () => {
        const response = await fetch("http://127.0.0.1:5000/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            // mode: 'no-cors',
            body: JSON.stringify()
        }).then(i => i.json())

        navigate("/login")
    }

    const darkmode = async () => {
        console.log("DARK MODE")
    }

    return (
        <AppBar>
            <Toolbar sx={{ minwidth: "100%" }}>
                <Typography variant="h5">
                    TODO List Manager
                </Typography>

                <Box sx={{ float: "right" }}>
                    <IconButton
                        onClick={openAccountMenu}>
                        <AccountCircle />
                        <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuOpen)}>
                            <MenuItem onClick={logout()}>Light / Dark Mode</MenuItem>
                            <MenuItem onClick={logout()}>Logout</MenuItem>
                        </Menu>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}