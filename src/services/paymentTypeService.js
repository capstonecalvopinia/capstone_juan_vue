// services/paymentTypeService.js
import axios from "axios";

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + "/payment-types";

// Obtener todos los tipos de pago
export const getAllPaymentTypes = async () => {
  try {
    console.log("YAAAA");
    const response = await axios.get(API_URL);
    console.log("response: ", response );
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error al obtener los tipos de pago:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message,
    };
  }
};

// Obtener un tipo de pago por ID
export const getPaymentTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error al obtener el tipo de pago:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message,
    };
  }
};

// Crear un nuevo tipo de pago
export const createPaymentType = async (name) => {
  try {
    const response = await axios.post(API_URL, { name });
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error al crear el tipo de pago:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message,
    };
  }
};

// Actualizar un tipo de pago
export const updatePaymentType = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { name });
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error al actualizar el tipo de pago:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message,
    };
  }
};

// Eliminar un tipo de pago
export const deletePaymentType = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error al eliminar el tipo de pago:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message,
    };
  }
};

// export default {
//   getAllPaymentTypes,
//   getPaymentTypeById,
//   createPaymentType,
//   updatePaymentType,
//   deletePaymentType,
// };
