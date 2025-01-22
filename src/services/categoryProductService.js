// services/categoryProductService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

// Obtener todos los productos de una categoría
export async function getProductsByCategory(categoryId) {
  try {
    const response = await axios.get(`${API_URL}/category/${categoryId}/products`);
    return response.data.status ? {
      status: true,
      data: response.data.data,
      msg: response.data.msg,
    } : {
      status: false,
      msg: response.data.msg,
      error: response.data.error
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return {
      status: false,
      msg: "Error al obtener los productos de la categoría",
      error: error.message
    };
  }
}

// Obtener todas las categorías de un producto
export async function getCategoriesByProduct(productId) {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}/categories`);
    return response.data.status ? {
      status: true,
      data: response.data.data,
      msg: response.data.msg,
    } : {
      status: false,
      msg: response.data.msg,
      error: response.data.error
    };
  } catch (error) {
    console.error("Error fetching categories by product:", error);
    return {
      status: false,
      msg: "Error al obtener las categorías del producto",
      error: error.message
    };
  }
}

// Crear una relación entre un Producto y una Categoría
export async function createCategoryProduct(productId, categoryId) {
  try {
    const response = await axios.post(`${API_URL}/category-product`, { productId, categoryId });
    return response.data.status ? {
      status: true,
      msg: response.data.msg,
    } : {
      status: false,
      msg: response.data.msg,
      error: response.data.error
    };
  } catch (error) {
    console.error("Error creating category-product relation:", error);
    return {
      status: false,
      msg: "Error al crear la relación entre producto y categoría",
      error: error.message
    };
  }
}

// Eliminar una relación entre un Producto y una Categoría
export async function deleteCategoryProduct(productId, categoryId) {
  try {
    const response = await axios.delete(`${API_URL}/category-product/${productId}/${categoryId}`);
    return response.data.status ? {
      status: true,
      msg: response.data.msg,
    } : {
      status: false,
      msg: response.data.msg,
      error: response.data.error
    };
  } catch (error) {
    console.error("Error deleting category-product relation:", error);
    return {
      status: false,
      msg: "Error al eliminar la relación entre producto y categoría",
      error: error.message
    };
  }
}
