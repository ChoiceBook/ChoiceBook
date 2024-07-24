import React, {useState} from 'react';
import './SearchPage.css';
import { SearchBar } from './components/Searchbar';
import { SearchResultsList } from './components/SearchResultsList';

const SearchPage = () => {
  const [results, SearchResults] = useState([]);
  return (
    <div className="search-bar-container">
      <div className="background">
        <SearchBar setResults = { SearchResults }/>
        <SearchResultsList results={results}/>
      </div>
    </div>
  );
};

export default SearchPage;
