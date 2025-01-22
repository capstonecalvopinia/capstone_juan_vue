// services/requestTypeService.js
import axios from 'axios';

let API_URL = process.env.VUE_APP_API_URL;
API_URL = API_URL + '/request-types';
console.log("API_URL:", API_URL);

  // Obtener todos los tipos de solicitud
  export async function getAllRequestTypes() {
    try {
      const response = await axios.get(API_URL);
      console.log("response getAllRequestTypes: ", response);
      if (response.data.status) {
        return {
          status: response.data.status,
          msg: response.data.msg,
          data: response.data.data
        };
      } else {
        return {
          status: false,
          msg: response.data.msg || 'Error fetching request types'
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: 'Error fetching request types',
        error: error.message
      };
    }
  }

  // Obtener un tipo de solicitud por ID
  export async function  getRequestTypeById(requestTypeId) {
    try {
      const response = await axios.get(`${API_URL}/${requestTypeId}`);
      if (response.data.status) {
        return {
          status: response.data.status,
          msg: response.data.msg,
          data: response.data.data
        };
      } else {
        return {
          status: false,
          msg: response.data.msg || 'Error fetching request type by ID'
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: 'Error fetching request type by ID',
        error: error.message
      };
    }
  }

  // Crear un nuevo tipo de solicitud
  export async function  createRequestType(requestTypeData) {
    try {
      const response = await axios.post(API_URL+"/register", requestTypeData);
      console.log("response createRequestType: ", response);
      if (response.data.status) {
        
        return {
          status: response.data.status,
          msg: response.data.msg,
          data: response.data
        };
      } else {
        
        return {
          status: false,
          msg: response.data.msg || 'Error creating request type'
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: 'Error creating request type',
        error: error.message
      };
    }
  }

  // Actualizar un tipo de solicitud existente
  export async function  updateRequestType(requestTypeId, updatedData) {
    try {
      const response = await axios.put(`${API_URL}/${requestTypeId}`, updatedData);
      
      if (response.statusText == "OK") {
        return {
          status: response.status,
          msg: response.msg,
          data: response.data
        };
      } else {
        return {
          status: false,
          msg: response.data.msg || 'Error updating request type'
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: 'Error updating request type',
        error: error.message
      };
    }
  }

  // Eliminar un tipo de solicitud
  export async function  deleteRequestType(requestTypeId) {
    console.log("mmmm");
    try {
      console.log("response deleteRequestType pre: ", requestTypeId);
      const response = await axios.delete(`${API_URL}/${requestTypeId}`);
      console.log("response deleteRequestType: ", response);
      if (response.data.status) {
        return {
          status: response.data.status,
          msg: response.data.msg
        };
      } else {
        return {
          status: false,
          msg: response.data.msg || 'Error deleting request type'
        };
      }
    } catch (error) {
      console.error("e:" , error);
      return {
        status: false,
        msg: 'Error deleting request type',
        error: error
      };
    }
  }
