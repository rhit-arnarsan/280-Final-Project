import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export function TopBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const openAccountMenu = (event) => {
        setMenuOpen(!menuOpen);
        setMenuAnchor(event.currentTarget)
    }

    return (
        <AppBar>
            <Toolbar sx={{ minwidth: "100%" }}>
                <Typography variant="h5">
                    Todo
                </Typography>

                <Box sx={{ float: "right" }}>
                    <IconButton
                        onClick={openAccountMenu}>
                        <AccountCircle />
                        <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuOpen)}>
                            <MenuItem onClick={() => console.log("flipped mode")}>Light / Dark Mode</MenuItem>
                            <MenuItem onClick={() => console.log("logged out")}>Logout</MenuItem>
                        </Menu>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}