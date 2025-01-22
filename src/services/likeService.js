// services/likeService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

// Función para obtener todos los "likes" de un producto
export async function fetchLikesByProduct(productId) {
  try {
    const response = await axios.get(`${API_URL}/likes/product/${productId}`);
    return response.data.status
      ? { status: true, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching likes by product:", error);
    return { status: false, error: error.message };
  }
}

// Función para obtener todos los "likes" de un usuario
export async function fetchLikesByUser(userId) {
  try {
    const response = await axios.get(`${API_URL}/likes/user/${userId}`);
    return response.data.status
      ? { status: true, data: response.data.data }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error fetching likes by user:", error);
    return { status: false, error: error.message };
  }
}

// Función para agregar un "like" (usuario a producto)
export async function addLike(productId, userId, date) {
  try {
    const response = await axios.post(
      `${API_URL}/likes`,
      { productId, userId, date },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.status
      ? { status: true, msg: response.data.msg }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error adding like:", error);
    return { status: false, error: error.message };
  }
}

// Función para eliminar un "like" (usuario de un producto)
export async function removeLike(productId, userId) {
  try {
    console.log("khé");
    const response = await axios.delete(`${API_URL}/likes/${productId}/${userId}`);
    return response.data.status
      ? { status: true, msg: response.data.msg }
      : { status: false, error: response.data.error };
  } catch (error) {
    console.error("Error removing like:", error);
    return { status: false, error: error.message };
  }
}
