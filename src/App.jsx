import { useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router'
import './App.css'

import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { Main } from './pages/Main.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<Main />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
