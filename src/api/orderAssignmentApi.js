import axios from './axiosConfig';

const API_BASE_URL = '/order-assignment';

// Get order assignment by order ID
export const getOrderAssignment = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update stage 1 assignment
export const updateStage1Assignment = async (orderId, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${orderId}/stage1`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update stage 2 assignment
export const updateStage2Assignment = async (orderId, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${orderId}/stage2`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update stage 3 assignment
export const updateStage3Assignment = async (orderId, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${orderId}/stage3`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all assignment options (farmers, suppliers, etc.)
export const getAssignmentOptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/options/all`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};