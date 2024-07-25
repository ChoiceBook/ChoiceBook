import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeButton from './HomeButton';
import RankList from './components/RankList';
import DeleteButton from './DeleteButton';
import './PlotPage.css'; // Assuming you have a CSS file for styling

const DeletePage = () => {
  const { user_id, plot_id } = useParams();
  const navigate = useNavigate();
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch(`http://172.10.7.117/api/plots/${plot_id}/users/${user_id}/allranks`)
      .then(response => response.json())
      .then(data => {
        setRanks(data);
      })
      .catch(error => console.error('Error fetching ranks:', error));
  }, [plot_id, user_id]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="plot-container">
      <HomeButton />
      <div className="background">
        <button className="close-button" onClick={handleClose}>X</button>
        <RankList ranks={ranks} />
        <DeleteButton plotId={plot_id} /> 
      </div>
    </div>
  );
};

export default DeletePage;
