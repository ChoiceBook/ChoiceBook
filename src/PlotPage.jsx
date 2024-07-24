import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PlotPage.css';
import TestBook from './components/TestBook';


const PlotPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const response = await fetch(`http://172.10.7.117/api/plots/${id}/items`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching plot data:', error);
      }
    };

    fetchPlotData();
  }, [id]);

  return (
    <div className="plot-container">
      <div className="background">
        <TestBook items={items} plotId={id} />
      </div>
    </div>
  );
};

export default PlotPage;
