<template>
  <div class="request-details">
    <!-- Header -->
    <header class="header">
      <h1>Detalles de la Solicitud</h1>
      <p>Consulta la información del Request ID: {{ requestID }}</p>
    </header>

    <!-- Información general -->
    <section v-if="request" class="request-info">
      <div class="general-info">
        <div class="info-card">
          <h2>Información del Cliente</h2>
          <ul>
            <li><strong>Usuario:</strong> {{ request.User_UserName }}</li>
            <li><strong>Email:</strong> {{ request.User_Email }}</li>
            <li>
              <strong>Identificación:</strong>
              {{ request.User_PersonIdentification }}
            </li>
            <li><strong>Celular:</strong> {{ request.User_Cellphone }}</li>
          </ul>
        </div>
        <div class="info-card">
          <h2>Detalles de la Solicitud</h2>
          <ul>
            <li><strong>ID:</strong> {{ request.RequestID }}</li>
            <li><strong>Prioridad:</strong> {{ request.Priority_Name }}</li>
            <li>
              <strong>Tipo de Solicitud:</strong> {{ request.RequestType_Name }}
            </li>
            <li><strong>Estado:</strong> {{ lastRequestState(request)?.Name || 'Sin estado' }}</li>
            <li><strong>Dirección:</strong> {{ request.Address }}</li>
          </ul>
        </div>
        <div class="info-card">
          <h2>Detalles de Prioridad</h2>
          <ul>
            <li><strong>Prioridad:</strong> {{ request.Priority_Name }}</li>
            <li>
              <strong>Razón de la Prioridad:</strong> {{ request.PriorityReason }}
            </li>
          </ul>
        </div>
        <div class="info-card">
          <h2>Pago</h2>
          <ul>
            <li>
              <strong>Tipo de Pago:</strong> {{ request.PaymentType_Name }}
            </li>
            <li><strong>Estado:</strong> {{ request.PaymentState_Name }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Productos -->
    <section v-if="request && request.Products" class="products-info">
      <h2>Productos Solicitados</h2>
      <div class="carousel">
        <div
          v-for="(product, index) in request.Products"
          :key="index"
          class="carousel-item"
        >
        <div class="carouselImageContainer">
          <img class="carouselImage" :src="product.Images[0].ImageUrl" :alt="product.Images[0].ImageID" />
        </div>
          
          <h3>{{ product.Name }}</h3>
          <p>{{ product.Description }}</p>
          <p><strong>Precio:</strong> {{ formatCurrency(product.Price) }}</p>
          <p><strong>Cantidad:</strong> {{ product.Quantity }}</p>
          <p>
            <strong>Subtotal:</strong>
            {{ formatCurrency(product.Price * product.Quantity) }}
          </p>
        </div>
      </div>
      <div class="total">
        <strong>Total del Pedido:</strong>
        {{ formatCurrency(calculateTotal()) }}
      </div>
    </section>

    <!-- Botón para volver -->
    <div class="actions">
      <button @click="$router.push('/admin/manageRequests')">Volver</button>
    </div>
  </div>
</template>

<script>
import { getRequestById } from "../../services/requestService";

export default {
  data() {
    return {
      requestID: null,
      request: null,
    };
  },
  methods: {
    lastRequestState(order) {
      console.log("lastRequestState order: ", )
      return order.RequestStates.at(-1) || null; // Devuelve el último estado o null si no hay elementos
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
    calculateTotal() {
      return this.request?.Products.reduce(
        (total, product) => total + product.Price * product.Quantity,
        0
      );
    },
  },
  async created() {
    this.requestID = this.$route.params.id;

    try {
      const res = await getRequestById(this.requestID);
      console.log("res created: ", res);
      if (res.status) {
        this.request = res.data;
      } else {
        this.$swal({
          title: "Error",
          text: res.msg,
          icon: "error",
        });
      }
    } catch (error) {
      this.$swal({
        title: "Error",
        text: "No se pudo cargar la información del Request.",
        icon: "error",
      });
    }
  },
};
</script>

<style scoped>
.carouselImageContainer{
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carouselImage{
  width: 100%;
  max-width: 150px;
  
  max-height: 150px;
}
/* General Styles */
.request-details {
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.request-info .general-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  flex: 1 1 calc(33% - 1rem);
  min-width: 280px;
}

.info-card h2 {
  margin-bottom: 1rem;
  color: #1eb2b8;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  margin-bottom: 0.5rem;
}

/* Carousel Styles */
.products-info {
  margin-top: 2rem;
}

.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
}

.carousel-item {
  min-width: 250px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
}

.carousel-item h3 {
  margin-bottom: 0.5rem;
  color: #1eb2b8;
}

.total {
  margin-top: 1rem;
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
}

/* Button Styles */
.actions {
  text-align: center;
  margin-top: 2rem;
}

button {
  padding: 0.7rem 1.5rem;
  background-color: #018c91;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1c696c;
}
</style>
