//import { useState } from 'react'
import './App.css'

import { Week } from './components/Week.jsx';
import { AppBar, Toolbar } from '@mui/material';
import { AccountCircle } from '@mui/icon-material';

function App() {

  return (
    <>
      <AppBar>
        <Toolbar>

        </Toolbar>
      </AppBar>
      {[1,2,3,4,5,6,7,8,9].map(i => Week(`Week ${i}`))}
    </>
  )
}

export default App
