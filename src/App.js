// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct imports
import Flipbook from './Flipbook';
import CreateTest from './CreateTest';
import './App.css'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flipbook />} />
        <Route path="/create-test" element={<CreateTest />} />
      </Routes>
    </Router>
  );
}

export default App;
