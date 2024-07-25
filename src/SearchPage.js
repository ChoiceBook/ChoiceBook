import React, {useState} from 'react';
import './SearchPage.css';
import { SearchBar } from './components/Searchbar';
import { SearchResultsList } from './components/SearchResultsList';
import HomeButton from './HomeButton';

const SearchPage = () => {
  const [results, SearchResults] = useState([]);
  return (
    <div className="search-bar-container">
      <HomeButton />
      <div className="background">
        <SearchBar setResults = { SearchResults }/>
        <SearchResultsList results={results}/>
      </div>
    </div>
  );
};

export default SearchPage;
