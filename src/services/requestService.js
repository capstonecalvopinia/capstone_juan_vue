// services/requestService.js
import axios from "axios";

let API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL);
API_URL = API_URL + "/requests";

export async function getAllRequests() {
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
        msg: response.data.msg || "Error fetching requests",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error fetching requests",
      error: error.message,
    };
  }
}

// Obtener un pedido por ID
export async function getRequestById(requestId) {
  try {
    console.log("getRequestById requestId: ", requestId);
    const response = await axios.get(`${API_URL}/${requestId}`);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error fetching request by ID",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error fetching request by ID",
      error: error.message,
    };
  }
}

// Obtener todos los pedidos por UserID
export async function getRequestsByUserId(userId) {
  try {
    console.log("userId in getRequestsByUserId:", userId);
    const response = await axios.get(`${API_URL}/user/${userId}`);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error fetching requests by UserID",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error fetching requests by UserID",
      error: error.message,
    };
  }
}

// Crear un nuevo pedido
export async function createRequest(requestData) {
  try {
    console.log("API_URL: ", API_URL);
    console.log("Data enviada al enviar request: ", requestData);
    const response = await axios.post(API_URL, requestData, {
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
        msg: response.data.msg || "Error creating request",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error creating request",
      error: error.message,
    };
  }
}

export async function requestPaymentVerify(requestData) {
  try {
    console.log("API_URL: ", API_URL);
    console.log("Data enviada al enviar requestPaymentVerify: ", requestData);
    const response = await axios.post(API_URL+"/requestPaymentVerify", requestData, {
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
        msg: response.data.msg || "Error creating requesting Payment Verify",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error creating requesting Payment Verify",
      error: error.message,
    };
  }
}

//Pagar con Paypal
export async function payWithPaypal(requestData) {
  try {
    //console.log("API_URL: ", API_URL);
    //console.log("Data enviada al enviar request: ", requestData);
    const response = await axios.post(API_URL+"/payWithPaypal", requestData, {
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
        msg: response.data.msg || "Error paying with Paypal",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error paying with Paypal",
      error: error.message,
    };
  }
}

// Actualizar un pedido existente
export async function updateRequest(requestId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/${requestId}`, updatedData);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error updating request",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error updating request",
      error: error.message,
    };
  }
}

export async function updateRequestPaymentState(requestId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/updatePaymentState/${requestId}`, updatedData);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
        data: response.data.data,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error updating request payment state",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error updating request payment state",
      error: error.message,
    };
  }
}

// Eliminar un pedido
export async function deleteRequest(requestId) {
  try {
    const response = await axios.delete(`${API_URL}/${requestId}`);
    if (response.data.status) {
      return {
        status: response.data.status,
        msg: response.data.msg,
      };
    } else {
      return {
        status: false,
        msg: response.data.msg || "Error deleting request",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "Error deleting request",
      error: error.message,
    };
  }
}
