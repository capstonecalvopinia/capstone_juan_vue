// services/paymentStateService.js
import axios from 'axios';

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + '/payment-states';

export const getAllPaymentStates = async () => {
  try {
    const response = await axios.get(API_URL);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching payment states:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
};

export const getPaymentStateById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching payment state by ID:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
};

export const createPaymentState = async (name) => {
  try {
    const response = await axios.post(API_URL, { name });
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error creating payment state:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
};

export const updatePaymentState = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { name });
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error updating payment state:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
};

export const deletePaymentState = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error deleting payment state:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
};
