import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL; // Asegúrate de que esta variable esté configurada correctamente

// Función para obtener todas las categorías
export async function fetchCategories() {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.status
      ? { status: true, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { status: false, error: error.message };
  }
}

// Función para obtener una categoría por ID
export async function fetchCategoryById(categoryId) {
  try {
    const response = await axios.get(`${API_URL}/categories/${categoryId}`);
    return response.data.status
      ? { status: true, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return { status: false, error: error.message };
  }
}

// Función para crear una nueva categoría
export async function createCategory(categoryData) {
  try {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.status
      ? { status: true, msg: response.data.msg, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error creating category:", error);
    return { status: false, error: error.message };
  }
}

// Función para actualizar una categoría
export async function updateCategory(categoryId, updatedData) {
  try {
    const response = await axios.put(
      `${API_URL}/categories/${categoryId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.status
      ? { status: true, msg: response.data.msg, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error updating category:", error);
    return { status: false, error: error.message };
  }
}

// Función para eliminar una categoría
export async function deleteCategory(categoryId) {
  try {
    const response = await axios.delete(`${API_URL}/categories/${categoryId}`);
    return response.data.status
      ? { status: true, msg: response.data.msg, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { status: false, error: error.message };
  }
}
