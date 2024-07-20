import React, { useState } from 'react';
import './SearchPage.css'; // Create and import a stylesheet for search page styles if needed

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate a search operation
    const results = fakeSearchOperation(searchQuery);
    setSearchResults(results);
  };

  const fakeSearchOperation = (query) => {
    // Simulate search results based on the query
    const data = [
      { id: 1, title: 'Result 1', description: 'This is the first result' },
      { id: 2, title: 'Result 2', description: 'This is the second result' },
      { id: 3, title: 'Result 3', description: 'This is the third result' },
    ];
    return data.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="search-page">
      <h1>Search Page</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter search query..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map(result => (
            <div key={result.id} className="search-result">
              <h2>{result.title}</h2>
              <p>{result.description}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
