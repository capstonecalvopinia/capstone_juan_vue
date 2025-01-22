import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL); 

const getAllRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    return {
      status: false,
      msg: 'Error al obtener las recetas',
      error: error.message
    };
  }
};

const getRecipeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    return {
      status: false,
      msg: 'Error al obtener la receta',
      error: error.message
    };
  }
};

const createRecipe = async (recipe) => {
  try {
    const response = await axios.post(`${API_URL}/recipes`, recipe);
    return {
      status: response.data.status,
      msg: response.data.msg,
      data: response.data.data
    };
  } catch (error) {
    return {
      status: false,
      msg: 'Error al crear la receta',
      error: error.message
    };
  }
};

const updateRecipe = async (id, recipe) => {
  try {
    const response = await axios.put(`${API_URL}/recipes/${id}`, recipe);
    return {
      status: response.data.status,
      msg: response.data.msg
    };
  } catch (error) {
    return {
      status: false,
      msg: 'Error al actualizar la receta',
      error: error.message
    };
  }
};

const deleteRecipe = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/recipes/${id}`);
    return {
      status: response.data.status,
      msg: response.data.msg
    };
  } catch (error) {
    return {
      status: false,
      msg: 'Error al eliminar la receta',
      error: error.message
    };
  }
};

export default {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
