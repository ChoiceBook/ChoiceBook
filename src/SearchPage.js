import React, {useState} from 'react';
import './SearchPage.css';
import { SearchBar } from './components/Searchbar';
import { SearchResulstList } from './components/SearchResultsList';

const SearchPage = () => {
  const [results, SearchResults] = useState([]);
  return (
    <div className="search-bar-container">
      <div className="background">
        <SearchBar setResults = { SearchResults }/>
        <SearchResulstList results={results}/>
      </div>
    </div>
  );
};

export default SearchPage;
