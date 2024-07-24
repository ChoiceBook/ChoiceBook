import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
import { SearchBar } from './components/Searchbar';
import { SearchResultsList } from './components/SearchResultsList';

const SearchPage = () => {
  const [results, SearchResults] = useState([]);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="search-bar-container">
      <div className="background">
        <button className="close-button" onClick={handleClose}>X</button>
        <SearchBar setResults={SearchResults} />
        <SearchResultsList results={results} />
      </div>
    </div>
  );
};

export default SearchPage;
