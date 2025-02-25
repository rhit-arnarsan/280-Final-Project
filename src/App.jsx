import { useState } from 'react'
import './App.css'

import { Week } from './components/Week.jsx';
import { Login } from './components/Login.jsx';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const openAccountMenu = (event) => {
    setMenuOpen(!menuOpen);
    setMenuAnchor(event.currentTarget)

  }

  return (
    <>
      <AppBar>
        <Toolbar sx={{minwidth: "100%"}}>
          <Typography variant="h5">
            Todo 
          </Typography>

          <Box sx={{float: "right"}}>
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
      {/* {[1,2,3,4,5,6,7,8,9].map(i => Week(`Week ${i}`))} */}
      <Login>

      </Login>
    </>
  )
}

export default App
