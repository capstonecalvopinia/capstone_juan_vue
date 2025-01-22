// services/CartService.js
import axios from "axios";

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + "/carts";

export async function getAllCarts() {
  try {
    const response = await axios.get(API_URL);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error fetching Carts",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error fetching Carts",
      error: error.message,
    };
  }
}

// Obtener un pedido por ID
export async function getCartByUserId(userId) {
  try {
    console.log("userId getCartByUserId:", userId);
    console.log(`${API_URL}/${userId}`);
    const response = await axios.get(`${API_URL}/${userId}`);
    console.log("response getCartByUserId: ", response);

    response.data.data = {
      userID: response.data.data.UserID, 
      priorityID: response.data.data.PriorityID,
      priorityReason: response.data.data.PriorityReason,
      requestTypeID: response.data.data.RequestType_RequestTypeID,
      requestStateID: response.data.data.RequestState_RequestStateID,
      paymentTypeID: response.data.data.PaymentType_PaymentTypeID,
      paymentStateID: response.data.data.PaymentStateID,
      address: response.data.data.Address,
      requestedDate: response.data.data.RequestedDate,
      requestedToDate: response.data.data.RequestedToDate,
      deliveredDate: response.data.data.DeliveredDate,
      products: response.data.data.Products? response.data.data.Products:response.data.data.products,
    };

    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error fetching Cart by ID",
      };
    }
  } catch (error) {
    console.log("getCartByUserId error: ", error);

    //Si existió algún error al obtener el carrito, se genera uno vacío
    const emptyCart = {
      userID: "",
      priorityID: "",
      priorityReason: "",
      requestTypeID: "",
      requestStateID: 1,
      paymentTypeID: "",
      paymentStateID: 1,
      address: "",
      requestedDate: "",
      requestedToDate: "",
      deliveredDate: null,
      products: [],
    };
    if (error.response.data) {
      if (error.response.data.status) {
        return {
          status: false,
          msg: error.response.data.msg,
          error: error.message,
          data: emptyCart,
        };
      }
    }

    return {
      status: false,
      msg: "Error fetching Cart by ID",
      error: error.message,
      data: emptyCart,
    };
  }
}

// Crear un nuevo pedido
export async function createCart(CartData) {
  try {
    console.log("API_URL: ", API_URL);
    console.log("Data enviada al enviar Cart: ", CartData);
    const response = await axios.post(API_URL, CartData, {
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
    return {
      status: false,
      msg: "Error creating Cart",
      error: error.message,
    };
  }
}

// Actualizar un pedido existente
export async function updateUserCart(userId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, updatedData);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error updating Cart",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error updating Cart",
      error: error.message,
    };
  }
}

// Eliminar un pedido
export async function deleteUserCart(userId) {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error deleting Cart",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error deleting Cart",
      error: error.message,
    };
  }
}
