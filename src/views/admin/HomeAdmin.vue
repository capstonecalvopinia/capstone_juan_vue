<template>
  <div class="dashboard-container">
    <!-- Sidebar con opciones de gestión -->
    <aside class="dashboard-sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <!-- Utilizar la nueva función para mover la vista hacia las secciones -->
        <li @click="scrollToSection('orders')">Panel de Gestión</li>
        <li @click="scrollToSection('statistics')">Estadísticas</li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <header class="dashboard-header">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>Selecciona una opción para gestionar tu tienda</p>
      </header>

      <!-- Opciones de Gestión -->
      <h2>Opciones de Gestión</h2>
      <section id="orders" class="management-options">
        
        <div class="option-card-container" v-for="option in managementOptions" :key="option.name">
          <div
            class="option-card"
            @click="goToSection(option.link)"
            v-if="option.id == 'orders' || user.rolID == 1"
          >
            <Icon-Iconify class="option-icon" :icon="option.icon" />
            <h3>
              <a class="linkA">{{ option.name }}</a>
            </h3>
          </div>
        </div>
      </section>

      <!-- Sección de Gráficas de Estadísticas -->
      <section id="statistics" class="statistics-section">
        <h2>Estadísticas Generales</h2>
        <div class="statistics-cards">
          <div
            class="stat-card"
            v-for="(stat, index) in statistics"
            :key="index"
          >
            <h3>{{ stat.title }}</h3>
            <div class="stat-chart">
              <!-- Placeholder para gráficos -->
              <span>{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { getAllStatistics } from "../../services/statisticsService.js";
import { useUserStore } from "./../../pluggins/stores/userStore.js";

export default {
  name: "HomeAdmin",
  data() {
    return {
      managementOptions: [
        {
          id: "orders",
          name: "Gestión de pedidos",
          icon: "fluent-mdl2:reservation-orders",
          link: "/admin/manageRequests",
        },
        {
          id: "users",
          name: "Gestión de usuarios",
          icon: "fa6-solid:users-between-lines",
          link: "/admin/manageUsers",
        },
        {
          id: "roles",
          name: "Gestión de roles",
          icon: "eos-icons:role-binding-outlined",
          link: "/admin/manageRols",
        },
        {
          id: "products",
          name: "Gestión de productos",
          icon: "fluent-mdl2:product-variant",
          link: "/admin/manageProducts",
        },
        {
          id: "units",
          name: "Gestión de unidades",
          icon: "game-icons:weight",
          link: "/admin/manageUnits",
        },
        {
          id: "paymentTypes",
          name: "Gestión de formas de pago",
          icon: "streamline:payment-10-solid",
          link: "/admin/managePaymentTypes",
        },
        {
          id: "priorities",
          name: "Gestión de niveles de prioridad",
          icon: "lets-icons:critical-duotone",
          link: "/admin/managePriorities",
        },
        {
          id: "requestType",
          name: "Gestión de tipos de entrega",
          icon: "fa-solid:shipping-fast",
          link: "/admin/manageRequestType",
        },
      ],
      statistics: [],
    };
  },
  mounted() {},
  async created() {
    const userStore = useUserStore();

    this.user = userStore.getUser;
    console.log("mounted this.user: ", this.user);

    try {
      let stats = await getAllStatistics();
      console.log("stats: ", stats);

      this.statistics = [
        { title: "Pedidos del Mes", value: stats.data.OrdersThisMonth },
        { title: "$ Total del Mes", value: stats.data.MonthlySales },
        { title: "Usuarios Registrados", value: stats.data.RegisteredUsers },
        { title: "Productos en Stock", value: stats.data.ProductsInStock },
        { title: "Roles Activos", value: stats.data.ActiveRoles },
      ];
      console.log("this.statistics: ", this.statistics);
    } catch (error) {
      console.error("Error al obtener statistics:", error);
    }
  },
  methods: {
    goToSection(sectionId) {
      console.log(`Redireccionando a la sección: ${sectionId}`);
      this.$router.push(sectionId);
    },
    scrollToSection(sectionId) {
      // Nueva función para hacer scroll hacia una sección específica
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        console.log(`Desplazándose a la sección: ${sectionId}`);
      } else {
        console.warn(`Sección no encontrada: ${sectionId}`);
      }
    },
  },
};
</script>



<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f4f5f7;
  color: #333;
}

.dashboard-sidebar {
  width: 250px;
  /* background-color: #2c3e50; */
  background-color: #018c91;
  color: #fff;
  padding: 20px;
}

.dashboard-sidebar h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.dashboard-sidebar ul {
  list-style: none;
  padding: 0;
}

.dashboard-sidebar li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.dashboard-sidebar li:hover {
  background-color: #02c2c9;
}

.dashboard-main {
  flex: 1;
  padding: 30px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.management-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.option-card-container{
  width: calc(25% - 20px);
  /* background-color: #ecf0f1; */
  /* background-color: #f2f9fa; */

  border-radius: 8px;
  padding: 20px;
  text-align: center;
  /* cursor: pointer; */
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  transition: transform 0.2s, box-shadow 0.2s;
}

.option-card {
  width: 100%;
  /* height: 100%; */
  /* background-color: #ecf0f1; */
  background-color: #f2f9fa;

  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.option-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.statistics-section {
  margin-top: 20px;
}

.statistics-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  background-color: #ecf0f1;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin-bottom: 15px;
}

.stat-chart {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}
</style>
