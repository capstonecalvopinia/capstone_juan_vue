import axios from "axios";

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL); 
API_URL = API_URL + '/steps';

// Función para obtener todos los pasos
export async function fetchSteps() {
  try {
    const response = await axios.get(API_URL);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching steps:", error);
    return {
      status: false,
      msg: "Error al obtener los pasos",
      error: error.message
    };
  }
}

// Función para obtener un paso por ID
export async function fetchStepById(stepId) {
  try {
    const response = await axios.get(`${API_URL}/${stepId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching step by ID:", error);
    return {
      status: false,
      msg: "Error al obtener el paso",
      error: error.message
    };
  }
}

// Función para obtener los pasos por RecipeID
export async function fetchStepsByRecipeId(recipeID) {
  try {
    const response = await axios.get(`${API_URL}/recipe/${recipeID}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error fetching steps by RecipeID:", error);
    return {
      status: false,
      msg: "Error al obtener los pasos por RecipeID",
      error: error.message
    };
  }
}

// Función para crear un nuevo paso
export async function createStep(stepData) {
  try {
    const response = await axios.post(API_URL, stepData, {
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
    console.error("Error creating step:", error);
    return {
      status: false,
      msg: "Error al crear el paso",
      error: error.message
    };
  }
}

// Función para actualizar un paso
export async function updateStep(stepId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/${stepId}`, updatedData, {
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
    console.error("Error updating step:", error);
    return {
      status: false,
      msg: "Error al actualizar el paso",
      error: error.message
    };
  }
}

// Función para eliminar un paso
export async function deleteStep(stepId) {
  try {
    const response = await axios.delete(`${API_URL}/${stepId}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error deleting step:", error);
    return {
      status: false,
      msg: "Error al eliminar el paso",
      error: error.message
    };
  }
}
