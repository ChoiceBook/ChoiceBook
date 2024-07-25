import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeButton from './HomeButton';
import { ItemResult } from './components/ItemResult';
import RankList from './components/RankList';
import DeleteButton from './DeleteButton';
import './PlotPage.css'; // Assuming you have a CSS file for styling

const DeletePage = () => {
  const { user_id, plot_id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    console.log(`Fetching items from http://172.10.7.117/api/plots/${plot_id}/items`);
    fetch(`http://172.10.7.117/api/plots/${plot_id}/items`)
      .then(response => response.json())
      .then(data => {
        setItems(data);
        console.log("Fetched items: ", data); // Log the fetched data directly
      })
      .catch(error => console.error('Error fetching items:', error));
  }, [plot_id, user_id]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="plot-container">
      <HomeButton />
      <div className="background">
        <button className="close-button" onClick={handleClose}>X</button>
        <div className="results-list">
            {
                items.map((items, id) => {
                    return <ItemResult result={items} key={id} />
                })
            }
        </div>
        <DeleteButton plotId={plot_id} /> 
      </div>
    </div>
  );
};

export default DeletePage;
