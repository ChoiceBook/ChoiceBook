import React from 'react'
import { useNavigate } from 'react-router-dom';

import "./SearchResult.css"

export const SearchResult = ({result}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/plots/${result.plot_id}`)
    }
    return (
        <div className="search-result" onClick={handleClick}>
          {result.title}
        </div>
      );
};