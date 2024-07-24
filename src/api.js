import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.10.7.117/api',
  withCredentials: true,
});

// Function to refresh the access token
export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

// Function to fetch plots (tests) for a specific user and category
export const fetchPlots = async (categoryId, userId) => {
  try {
    const response = await api.get(`/users/${userId}/categories/${categoryId}/plots`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plots:', error);
    throw error; // Throw error to be handled by calling code
  }
};

// Function to fetch ranks for a specific plot and user
export const fetchRanks = async (plotId, userId) => {
  try {
    const response = await api.get(`/plots/${plotId}/users/${userId}/ranks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ranks:', error);
    throw error; // Throw error to be handled by calling code
  }
};

// Function to fetch item details based on item ID
export const fetchItemDetails = async (itemId) => {
  try {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error; // Throw error to be handled by calling code
  }
};

export const fetchUsername = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error; // Throw error to be handled by calling code
  }
};

export const fetchUserPlots = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error; // Throw error to be handled by calling code
  }
};

export default api;
