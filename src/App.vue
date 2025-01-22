<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div class="logo"><a href="/" class="linkA">Frish</a></div>
      <div class="delivery" v-if="user?.rolID !== 1">
        <p>Agregar a</p>
        <a class="linkA" href="/cart">ingresar dirección</a>
      </div>

      <!-- Normal user -->
      <div class="user-options_cart_container" v-if="user?.rolID == 2 || !user">
        <div id="user-options_cart">
          <a href="/requests/list" class="linkA">Envíos</a>
        </div>
        <Icon-Iconify class="icon" icon="akar-icons:shipping-box-v2" />
      </div>

      <div class="user-options_cart_container" v-if="user?.rolID == 2 || !user">
        <div id="user-options_cart">
          <a href="/cart" class="linkA">Carrito</a>
        </div>
        <Icon-Iconify class="icon" icon="mdi:cart" />
      </div>

      <!-- Admin user -->
      <div
        class="user-options_cart_container"
        v-if="
          user?.rolID == 1 ||
          user?.rolID == 3 ||
          user?.rolID == 4 ||
          user?.rolID == 5
        "
      >
        <div id="user-options_admin">
          <a href="/admin/home" class="linkA">{{ capitalize(user?.rolName) }}</a>
        </div>
        <Icon-Iconify class="icon" icon="eos-icons:admin-outlined" />
      </div>

      <div>
        <div class="user-options_login_container" v-if="!userStore?.isLogued">
          <div id="user-options_login">
            <p>Cuenta</p>
            <a href="/auth" class="linkA">Ingresar</a>
          </div>
          <Icon-Iconify class="icon" icon="hugeicons:user" />
        </div>

        <div class="user-options_login_container" v-else>
          <div id="user-options_login">
            <p>Bienvenido, {{ userStore.user?.name }}</p>
            <a href="/auth" @click="logout" class="linkA">Cerrar Sesión</a>
          </div>
          <Icon-Iconify class="icon" icon="hugeicons:user" />
        </div>
      </div>
    </header>
  </div>
  <Suspense>
    <RouterView class="routerContent"></RouterView>
  </Suspense>
</template>

<script>
import { RouterView } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "./pluggins/stores/userStore.js";

export default {
  name: "App",
  components: {
    RouterView,
  },
  methods: {
    capitalize(text) {
      if (!text) return ""; // Maneja casos donde la cadena está vacía o es null
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
  },
  beforeUpdate() {
    const userStore = useUserStore();

    this.user = userStore.getUser;
    console.log("beforeUpdate this.user: ", this.user);
  },
  mounted() {
    const userStore = useUserStore();

    this.user = userStore.getUser;
    console.log("mounted this.user: ", this.user);
  },
  setup() {
    const searchQuery = ref("");
    const userStore = useUserStore();

    //const user = userStore.getUser;
    // Función para cerrar sesión
    const logout = () => {
      userStore.logOut(null); // Limpia el usuario en el store
      userStore.setIsLogued(false); // Cambia el estado de logueado en el store
    };

    // Función de búsqueda
    const search = () => {
      console.log("searchQuery:", searchQuery.value);
      if (searchQuery.value.trim()) {
        console.log("Buscando:", searchQuery.value);
        // Implementa la lógica de búsqueda (API call, redirección, etc.)
      } else {
        console.log("Por favor, ingrese un término de búsqueda.");
      }
    };

    return {
      searchQuery,
      userStore,
      logout,
      search,
    };
  },
  data() {
    return {
      user: {},
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

p {
  width: fit-content;

  padding: 0px;
  margin: 0px;
}

.user-options_login_container {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: 50px;

  justify-content: space-evenly;
  align-items: center;
}

.user-options_cart_container {
  display: flex;
  flex-direction: row;
  width: 100px;
  height: 50px;

  justify-content: space-evenly;
  align-items: center;
}

#user-options_login {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

#user-options_cart {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.container {
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
}

.delivery a,
.delivery p {
  width: fit-content;

  padding: 0px;
  margin: 0px;
}

.delivery,
.user-options {
  width: 136px;
  height: 50px;

  display: flex;
  justify-content: space-evenly;
  align-items: start;
  gap: 0px;
  flex-direction: column;
}
.search input {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.categories {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
  margin: 20px 0;
  /* background-color: #f4f4f4; */
  border-bottom: 1px solid rgb(210, 206, 206);
}

#enterAdress {
  /* margin-left: 15px; */
}

.linkA {
  text-decoration: none;
  /* color: rgb(238, 152, 47); */
  color: #018c91;
}

.category {
  background: none;
  border: none;
}

.category:hover,
#category_all:hover {
  cursor: pointer;
}

#category_all {
  background: none;
  border: none;
  display: flex;
  flex-direction: row;

  align-items: center;

  background-color: #b0d1d2;

  border-radius: 15px;

  padding: 13px 10px;
}

.icon {
  width: 30px;
  height: 30px;
  margin: 0px 2px;
}
</style>
