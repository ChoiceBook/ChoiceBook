// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct imports
import FlipbookWithLogin from './FlipbookWithLogin';
import CreateTest from './CreateTest';
import SearchPage from './SearchPage';
import './App.css'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlipbookWithLogin />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
