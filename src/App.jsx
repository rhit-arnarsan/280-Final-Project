import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router'
import './App.css'

import { Week } from './components/Week.jsx';
import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { TopBar } from './components/TopBar.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
