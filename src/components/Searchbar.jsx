import React, {useState} from 'react';
import {FaSearch} from "react-icons/fa"
import "./SearchBar.css"


export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState("")

    const fetchdata = async (value) => {
        try {
            const response = await fetch("http://172.10.7.117/api/plots");
            const plots = await response.json();

            // 플롯 제목을 기준으로 필터링
            const filteredPlots = plots.filter(plot =>
                plot.title.toLowerCase().includes(value.toLowerCase())
            );

            //각 플롯의 아이템 데이터를 가져와서 필터링
            for (let plot of plots) {
                const itemsResponse = await fetch(`http://172.10.7.117/api/plots/${plot.plot_id}/items`);
                const items = await itemsResponse.json();

                const matchingItems = items.filter(item =>
                    item.item_name === value
                );

                if (matchingItems.length > 0) {
                    filteredPlots.push(plot);
                }
            }

            setResults(filteredPlots);
            console.log(filteredPlots);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    const handleChange = (value) => {
        setInput(value)
        fetchdata(value)
    }
    return (
    <div className="input-wrapper">
        <FaSearch id="search-icon"/>
        <input 
            placeholder="검색어를 입력하세요" 
            value={input} 
            onChange={(e) => handleChange(e.target.value)}
        />
    </div>
    );
};