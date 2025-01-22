// services/productService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL); 

// Obtener todos los productos
export async function fetchProducts() {
  try {
    console.log("Fetching products");
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Registrar un nuevo producto
export async function registerProduct(productData) {
  try {
    console.log("Registering product");
    const response = await axios.post(`${API_URL}/products/register`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response.data: ", response.data);

    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error registering product:", error);
    return { status: false, error };
  }
}

// Obtener un producto por ID
export async function fetchProductById(productId) {
  try {
    console.log(`Fetching product with ID: ${productId}`);
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// Actualizar un producto por ID
export async function updateProduct(productId, productData) {
  try {
    console.log(`Updating product with ID: ${productId}`);
    const response = await axios.put(`${API_URL}/products/${productId}`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { status: false, error };
  }
}

// Eliminar un producto por ID
export async function deleteProduct(productId) {
  try {
    console.log(`Deleting product with ID: ${productId}`);
    const response = await axios.delete(`${API_URL}/products/${productId}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { status: false, error };
  }
}
