// services/userService.js
import axios from "axios";
import { useUserStore } from "../pluggins/stores/userStore";
import { useCartStore } from "../pluggins/stores/cartStore";
import { getCartByUserId } from "../services/cartService";

const API_URL = process.env.VUE_APP_API_URL;
console.log("API_URL:", API_URL); // Confirma que este valor sea el correcto

// Función para obtener todos los usuarios
export async function fetchUsers() {
  try {
    console.log("Fetching users");
    const response = await axios.get(`${API_URL}/users`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { status: false, error };
  }
}

export async function fetchFinancialUsers() {
  try {
    console.log("Fetching financial users");
    const response = await axios.get(`${API_URL}/users/financials`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error fetching financial users:", error);
    return { status: false, error };
  }
}

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  try {
    console.log("Registering user");
    console.log("userData: ", userData);
    const response = await axios.post(`${API_URL}/users/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response.data: ", response.data);

    const userStore = useUserStore();
    const cartStore = useCartStore();
    try {
      const userID = response.data.userID;
      userData = {
        ...userData,
        userID,
      };
      userStore.setUser(userData);
      userStore.setIsLogued(true);

      const res = await getCartByUserId(userID);
      console.log("res getCartByUserId in register: ", res);

      cartStore.setCart(res.data);

    } catch (error) {
      console.log("Error saving user data in store: ", error);
      return { status: false, data: error };
    }

    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error registering user:", error);
    return { status: false, error };
  }
}

// Función para iniciar sesión
export async function loginUser(email, password) {
  try {
    console.log("Logging in user");
    const response = await axios.post(
      `${API_URL}/users/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.user) {
      const userStore = useUserStore();
      const cartStore = useCartStore();

      response.data.user = {
        address: response.data.user.Address,
        bornDate: response.data.user.BornDate,
        cellphone: response.data.user.Cellphone,
        email: response.data.user.Email,
        name: response.data.user.Name,
        personIdentification: response.data.user.PersonIdentification,
        rolID: response.data.user.RolID,
        userID: response.data.user.UserID,
        rolName: response.data.user.RolName,
      };

      userStore.setUser(response.data.user);
      userStore.setIsLogued(true);

      const res = await getCartByUserId(response.data.user.userID);
      console.log("res getCartByUserId in login: ", res);

      cartStore.setCart(res.data);

      return { status: true, data: response.data };
    } else {
      console.log("Login failed: User data not found");
      return { status: false, error: "Login failed: User data not found" };
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return { status: false, error };
  }
}

// Función para obtener un usuario por ID
export async function fetchUserById(userId) {
  try {
    console.log(`Fetching user by ID: ${userId}`);
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { status: false, error };
  }
}

// Función para actualizar un usuario
export async function updateUser(userId, updatedData) {
  try {
    console.log(`Updating user with ID: ${userId}`);
    console.log("updatedData: ", updatedData);
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error updating user:", error);
    return { status: false, error };
  }
}

// Función para eliminar un usuario
export async function deleteUser(userId) {
  try {
    console.log(`Deleting user with ID: ${userId}`);
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { status: false, error };
  }
}

// Función para obtener usuarios por rol
export async function fetchUsersByRole(rolID) {
  try {
    console.log(`Fetching users by role ID: ${rolID}`);
    const response = await axios.get(`${API_URL}/users/role/${rolID}`);
    return { status: true, data: response.data };
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return { status: false, error };
  }
}
