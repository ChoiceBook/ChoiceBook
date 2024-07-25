import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useParams } from 'react-router-dom';
import './PlotPage.css';
import TestBook from './components/TestBook';
import HomeButton from './HomeButton';
import RetryButton from './RetryButton';

const RankPage = () => {
  const { user_id, plot_id } = useParams();
  const [items, setItems] = useState([]);
  const [plotTitle, setPlotTitle] = useState(''); // Add state for the plot title
  const [plotDescription, setPlotDescription] = useState(''); // Add state for the plot title
  const navigate = useNavigate(); 


  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="plot-container">
      <HomeButton />
      <div className="background">
        <button className="close-button" onClick={handleClose}>X</button>
        <RetryButton plotId={plot_id} /> 
      </div>
    </div>
  );
};

export default RankPage;
