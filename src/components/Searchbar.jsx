import React, {useState} from 'react';
import {FaSearch} from "react-icons/fa"
import "./SearchBar.css"


export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState("")

    const fetchdata = (value) => {
        fetch("http://172.10.7.117/api/plots")
          .then((response) => response.json())
          .then((json) => {
            // title에 입력된 문자열이 포함된 항목만 필터링
            const resuluts = json.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
            setResults(resuluts);
            console.log(resuluts);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      };
    

    const handleChange = (value) => {
        setInput(value)
        fetchdata(value)
    }
    return (
    <div className="input-wrapper">
        <FaSearch id="search-icon"/>
        <input 
            placeholder="Type to search..." 
            value={input} 
            onChange={(e) => handleChange(e.target.value)}
        />
    </div>
    );
};