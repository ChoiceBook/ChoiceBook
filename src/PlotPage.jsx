import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PlotPage.css';
import TestBook from './components/TestBook';
import HomeButton from './HomeButton';

const PlotPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [plotTitle, setPlotTitle] = useState(''); // Add state for the plot title
  const [plotDescription, setPlotDescription] = useState(''); // Add state for the plot title

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const plotResponse = await fetch(`http://172.10.7.117/api/plots/${id}`);
        const plotData = await plotResponse.json();

        // Check if plotData is an array and extract the first element
        if (Array.isArray(plotData) && plotData.length > 0) {
          const plot = plotData[0]; // Extract the first element of the array
          setPlotTitle(plot.title); // Set the plot title
          setPlotDescription(plot.description);
        } else {
          console.error('Unexpected plot data format');
        }

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
      <HomeButton />
      <div className="background">
          <h1>{plotTitle}</h1> {/* Display the plot title */}
          <p>{plotDescription}</p>
        <TestBook items={items} plotId={id} />
      </div>
    </div>
  );
};

export default PlotPage;
