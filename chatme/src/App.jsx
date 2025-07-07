import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Register from './Components/Registration';
import Home from './Components/home';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
  );
}

export default App
