// services/requestStateService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL); // Confirma que este valor sea el correcto

// Función para obtener todos los estados de solicitud
export async function fetchRequestStates() {
  try {
    const response = await axios.get(`${API_URL}/request-states`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching request states:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para obtener un estado de solicitud por ID
export async function fetchRequestStateById(requestStateId) {
  try {
    const response = await axios.get(`${API_URL}/request-states/${requestStateId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching request state by ID:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para crear un nuevo estado de solicitud
export async function createRequestState(requestStateData) {
  try {
    const response = await axios.post(`${API_URL}/request-states`, requestStateData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error creating request state:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para actualizar un estado de solicitud
export async function updateRequestState(requestStateId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/request-states/${requestStateId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error updating request state:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para eliminar un estado de solicitud
export async function deleteRequestState(requestStateId) {
  try {
    const response = await axios.delete(`${API_URL}/request-states/${requestStateId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error deleting request state:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}
