// services/rolService.js
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL;

// Obtener todos los roles
export async function fetchRoles() {
  try {
    console.log("Fetching roles");
    const response = await axios.get(`${API_URL}/roles`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { status: false, error };
  }
}

// Crear un nuevo rol
export async function createRole(roleData) {
  try {
    console.log("Creating role");
    console.log("roleData en service: ", roleData);
    const response = await axios.post(`${API_URL}/roles`, roleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error creating role:", error);
    return { status: false, error };
  }
}

// Actualizar un rol existente
export async function updateRole(roleId, roleData) {
  try {
    console.log("Updating role: rolID: ", roleId, "roleData: ", roleData);
    const response = await axios.put(`${API_URL}/roles/${roleId}`, roleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error updating role:", error);
    return { status: false, error };
  }
}

// Eliminar un rol
export async function deleteRole(roleId) {
  try {
    console.log("Deleting role");
    const response = await axios.delete(`${API_URL}/roles/${roleId}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error deleting role:", error);
    return { status: false, error };
  }
}
