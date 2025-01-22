import axios from "axios";

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + "/recommendations";

// Crear un nuevo pedido
export async function getRecommendationsByPurchaseRecord(data) {
  try {
    //userId
    console.log("API_URL: ", API_URL);
    console.log(
      "Data enviada al enviar getRecommendationsByPurchaseRecord: ",
      data
    );
    const response = await axios.post(API_URL + "/pastPurchases", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error creating Cart",
      };
    }
  } catch (error) {
    console.error("error: ", error);
    return {
      status: false,
      msg: "Error creating Cart",
      error: error.message,
    };
  }
}

// Obtener recomendaciones de productos complementarios basados en el carrito
export async function getCartRecommendations(data) {
  try {
    console.log("API_URL: ", API_URL);
    console.log("Data enviada al enviar getCartRecommendations: ", data);
    
    const response = await axios.post(
      API_URL + "/complementaryProducts",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error obteniendo recomendaciones de carrito",
      };
    }
  } catch (error) {
    console.error("error: ", error);
    return {
      status: false,
      msg: "Error obteniendo recomendaciones de carrito",
      error: error.message,
    };
  }
}

// Obtener recomendaciones de recetas basadas en el producto
export async function getRecipeRecommendations(data) {
  try {
    console.log("API_URL: ", API_URL);
    console.log("Data enviada al enviar getRecipeRecommendations: ", data);
    
    const response = await axios.post(
      API_URL + "/productRecipes", // Endpoint de recomendaciones de recetas
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error obteniendo recomendaciones de recetas",
      };
    }
  } catch (error) {
    console.error("error: ", error);
    return {
      status: false,
      msg: "Error obteniendo recomendaciones de recetas",
      error: error.message,
    };
  }
}
