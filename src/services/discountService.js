// services/discountService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);

// Obtener todos los descuentos
export async function fetchDiscounts() {
  try {
    console.log("Fetching discounts");
    const response = await axios.get(`${API_URL}/discounts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
}

// Registrar un nuevo descuento
export async function registerDiscount(discountData) {
  try {
    console.log("Registering discount");
    const response = await axios.post(`${API_URL}/discounts/register`, discountData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response.data: ", response.data);

    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error registering discount:", error);
    return { status: false, error };
  }
}

// Obtener un descuento por ID
export async function fetchDiscountById(discountId) {
  try {
    console.log(`Fetching discount with ID: ${discountId}`);
    const response = await axios.get(`${API_URL}/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discount:", error);
    throw error;
  }
}

// Obtener descuentos activos por ProductID
export async function fetchActiveDiscountsByProductId(productId) {
  try {
    console.log(`Fetching active discounts for product ID: ${productId}`);
    const response = await axios.get(`${API_URL}/discounts/active/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active discounts:", error);
    throw error;
  }
}

// Eliminar un descuento por ID
export async function deleteDiscount(discountId) {
  try {
    console.log(`Deleting discount with ID: ${discountId}`);
    const response = await axios.delete(`${API_URL}/discounts/${discountId}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error deleting discount:", error);
    return { status: false, error };
  }
}

// Actualizar un descuento por ID
export async function updateDiscount(discountId, discountData) {
  try {
    console.log(`Updating discount with ID: ${discountId}`);
    const response = await axios.put(`${API_URL}/discounts/${discountId}`, discountData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error updating discount:", error);
    return { status: false, error };
  }
}

