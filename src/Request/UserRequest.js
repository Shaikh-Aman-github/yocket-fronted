import axios from 'axios';

const API = axios.create({ baseURL: 'https://yocket-backed-api.onrender.com/' });

export const fetchCriminal = async () => {
  try {
    const response = await API.get('/getCitiesAndVehicle/criminal');
    return response.data;
  } catch (error) {
    console.error('Error fetching criminal:', error);
    throw error;
  }
};

export const fetchCities = async () => {
  try {
    const response = await API.get('/getCitiesAndVehicle/cities');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const fetchCops = async () => {
  try {
    const response = await API.get('/getCitiesAndVehicle/cops');
    return response.data;
  } catch (error) {
    console.error('Error fetching cops:', error);
    throw error;
  }
};

export const fetchVehicles = async () => {
  try {
    const response = await API.get('/getCitiesAndVehicle/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const findCriminal = async (selectedCopsData) => {
  try {
    const response = await API.post('/getfindCriminalRoutes/findCriminal', selectedCopsData);
    return response.data;
  } catch (error) {
    console.error('Error fetching findCriminal:', error);
    throw error;
  }
};

