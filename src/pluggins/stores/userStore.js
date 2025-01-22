import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    // Usa un try-catch para manejar errores de parseo
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem("user")) || null;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
      }
    })(),
    isLogued: localStorage.getItem("isLogued") === "true",
  }),
  getters: {
    getUser: (state) => state.user,
    getIsLogued: (state) => state.isLogued,
  },
  actions: {
    setUser(user) {
      console.log("User recibido en store:", user);

      const {
        userID,
        name,
        email,
        password,
        bornDate,
        address,
        cellphone,
        rolID,
        rolName,
        personIdentification,
      } = user;

      const userAux = {
        userID,
        name,
        email,
        password,
        bornDate,
        address,
        cellphone,
        rolID,
        rolName,
        personIdentification,
      };

      console.log("userAux antes de guardar en localStorage:", userAux);

      this.user = userAux;

      // Guardar los datos en localStorage y verificar que se guarden correctamente
      try {
        localStorage.setItem("user", JSON.stringify(userAux));
        console.log("Datos de usuario guardados en localStorage:", userAux);
      } catch (error) {
        console.error("Error guardando user en localStorage:", error);
      }
    },
    logOut() {
      const userAux = {
        userID: null,
        name: null,
        email: null,
        password: null,
        bornDate: null,
        address: null,
        cellphone: null,
        rolID: null,
        rolName: null,
        personIdentification: null,
      };

      console.log("userAux antes de cerrrar sesión:", userAux);

      this.user = userAux;

      // Guardar los datos en localStorage y verificar que se guarden correctamente
      try {
        localStorage.setItem("user", JSON.stringify(userAux));
        console.log("Datos de usuario guardados en localStorage al cerrar sesión:", userAux);
      } catch (error) {
        console.error("Error guardando user en localStorage al cerrar sesión:", error);
      }
    },
    setIsLogued(isLogued) {
      this.isLogued = isLogued;
      localStorage.setItem("isLogued", JSON.stringify(isLogued));
    },
  },
});
