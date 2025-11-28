import api from './axiosConfig';

export const createLabour = async (labourData) => {
  try {
    const response = await api.post('/labour/create', labourData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllLabours = async () => {
  try {
    const response = await api.get('/labour/list');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLabourById = async (id) => {
  try {
    const response = await api.get(`/labour/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateLabour = async (id, labourData) => {
  try {
    const response = await api.put(`/labour/${id}`, labourData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteLabour = async (id) => {
  try {
    const response = await api.delete(`/labour/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
