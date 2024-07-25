import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RetryButton.css'; // You can style the button in this CSS file

const DeleteButton = ({ plotId }) => { // Destructure plotId from props
  const navigate = useNavigate();

  const handleDeletePlot = async () => {
    try {
      const response = await fetch(`http://172.10.7.117/api/plots/${plotId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete plot');
      }

      navigate('/'); // Navigate to the home page after deletion
      // Refresh the page or handle post-deletion actions
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button className="retry-button" onClick={handleDeletePlot}>
      삭제하기
    </button>
  );
};

export default DeleteButton;
