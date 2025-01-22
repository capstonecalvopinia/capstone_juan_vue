// services/productRecipeService.js
import axios from 'axios';

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + '/product-recipes';

// Función para obtener todas las relaciones entre productos y recetas
export async function fetchProductRecipes() {
  try {
    const response = await axios.get(API_URL);
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching product recipes:", error);
    return { status: false, error: error.message };
  }
}

// Función para obtener una relación entre un producto y receta específica
export async function fetchProductRecipe(productId, recipeId) {
  try {
    const response = await axios.get(`${API_URL}/${productId}/${recipeId}`);
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching product recipe:", error);
    return { status: false, error: error.message };
  }
}

// Función para crear una nueva relación entre producto y receta
export async function createProductRecipe(productId, recipeId, quantity, unitId) {
  try {
    const response = await axios.post(API_URL, { productId, recipeId, quantity, unitId }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error creating product recipe:", error);
    return { status: false, error: error.message };
  }
}

// Función para actualizar una relación entre producto y receta
export async function updateProductRecipe(productId, recipeId, quantity, unitId) {
  try {
    const response = await axios.put(API_URL, { productId, recipeId, quantity, unitId }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error updating product recipe:", error);
    return { status: false, error: error.message };
  }
}

// Función para eliminar una relación entre producto y receta
export async function deleteProductRecipe(productId, recipeId) {
  try {
    const response = await axios.delete(`${API_URL}/${productId}/${recipeId}`);
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error deleting product recipe:", error);
    return { status: false, error: error.message };
  }
}

// Nueva función para obtener todas las recetas de un producto
export async function fetchRecipesForProduct(productId) {
  try {
    const response = await axios.get(`${API_URL}/recipes/${productId}`);
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching recipes for product:", error);
    return { status: false, error: error.message };
  }
}

// Nueva función para obtener todos los productos de una receta
export async function fetchProductsForRecipe(recipeId) {
  try {
    console.log("fetchProductsForRecipe");
    console.log("`${API_URL}/products/${recipeId}`: ", `${API_URL}/products/${recipeId}`);
    const response = await axios.get(`${API_URL}/products/${recipeId}`);
    return response.data.status ? { status: true, data: response.data.data } : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching products for recipe:", error);
    return { status: false, error: error.message };
  }
}
