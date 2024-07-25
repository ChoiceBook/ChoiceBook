import React from 'react';

import "./SearchResult.css";

export const ItemResult = ({ result }) => {


    return (
        <div className="search-result">
            { <img src={result.item_image_url} alt={result.title} className="result-image" />}
            <div className='result-title'>{result.item_name}</div>
        </div>
    );
};
