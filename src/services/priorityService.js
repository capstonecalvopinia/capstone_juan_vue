// services/priorityService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL); // Confirma que este valor sea el correcto

// Función para obtener todas las prioridades
export async function fetchPriorities() {
  try {
    const response = await axios.get(`${API_URL}/priorities`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching priorities:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para obtener una prioridad por ID
export async function fetchPriorityById(priorityId) {
  try {
    const response = await axios.get(`${API_URL}/priorities/${priorityId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching priority by ID:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para crear una nueva prioridad
export async function createPriority(priorityData) {
  try {
    const response = await axios.post(`${API_URL}/priorities`, priorityData, {
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
    console.error("Error creating priority:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para actualizar una prioridad
export async function updatePriority(priorityId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/priorities/${priorityId}`, updatedData, {
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
    console.error("Error updating priority:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para eliminar una prioridad
export async function deletePriority(priorityId) {
  try {
    const response = await axios.delete(`${API_URL}/priorities/${priorityId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error deleting priority:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}
