import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./SearchResult.css";

export const SearchResult = ({ result }) => {
    const navigate = useNavigate();
    const [item_image_url, setImageUrl] = useState('');

    useEffect(() => {
        const fetchRandomImage = async () => {
            try {
                //console.log(`http://172.10.7.117/api/plots/${result.plot_id}/random-image`);
                const response = await axios.get(`http://172.10.7.117/api/plots/${result.plot_id}/random-image`);
                console.log(response)
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data);
                    setImageUrl(data.item_image_url); // 서버가 반환하는 이미지 URL을 상태에 저장
                } else {
                    console.error('Failed to fetch image');
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchRandomImage();
    }, [result.plot_id]);

    const handleClick = () => {
        navigate(`/plots/${result.plot_id}`);
    };

    return (
        <div className="search-result" onClick={handleClick}>
            {item_image_url && <img src={item_image_url} alt={result.title} className="result-image" />}
            <div className='result-title'>{result.title}</div>
        </div>
    );
};
