// services/unitService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

// Función para obtener todas las unidades
export async function fetchUnits() {
  try {
    const response = await axios.get(`${API_URL}/units`);
    console.log("response: ", response);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.units
    };
  } catch (error) {
    console.error("Error fetching units:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para registrar una nueva unidad
export async function registerUnit(unitData) {
  try {
    const response = await axios.post(`${API_URL}/units`, unitData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data
    };
  } catch (error) {
    console.error("Error registering unit:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para obtener una unidad por ID
export async function fetchUnitById(unitId) {
  try {
    const response = await axios.get(`${API_URL}/units/${unitId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching unit by ID:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para actualizar una unidad
export async function updateUnit(unitId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/units/${unitId}`, updatedData, {
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
    console.error("Error updating unit:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}

// Función para eliminar una unidad
export async function deleteUnit(unitId) {
  try {
    const response = await axios.delete(`${API_URL}/units/${unitId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return {
      status: false,
      msg: error.response ? error.response.data.msg : error.message,
      error: error.message
    };
  }
}
