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
                const response = await axios.get(`http://172.10.7.117/api/plots/${result.plot_id}/random-image`);
                if (response.status === 200) {
                    const data = response.data;
                    setImageUrl(data.item_image_url); // 서버가 반환하는 이미지 URL을 상태에 저장
                    localStorage.setItem(`plot_${result.plot_id}_image`, data.item_image_url); // 이미지 URL을 localStorage에 저장
                } else {
                    console.error('Failed to fetch image');
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        const savedImageUrl = localStorage.getItem(`plot_${result.plot_id}_image`);
        if (savedImageUrl) {
            setImageUrl(savedImageUrl); // 저장된 이미지 URL이 있으면 설정
        } else {
            fetchRandomImage(); // 저장된 이미지 URL이 없으면 새로 가져오기
        }
    }, [result.plot_id]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem(`plot_${result.plot_id}_image`); // 창을 떠날 때 로컬 스토리지를 비웁니다.
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
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
