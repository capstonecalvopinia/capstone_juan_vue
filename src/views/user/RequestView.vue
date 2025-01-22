<template>
  <div class="order-details">
    <div class="container-left">
      <button class="icon-button" @click="goBack()">
        <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
      </button>
    </div>
    <div class="container-right">
      <!-- Cargando -->
      <div v-if="loading" class="loading">
        <p>Cargando detalles del pedido...</p>
      </div>

      <!-- Error al cargar -->
      <div v-else-if="error" class="error-message">
        <p>Error: {{ error }}</p>
      </div>

      <!-- Información del pedido -->
      <div v-else-if="request" class="order-info">
        <h1 class="order-title">
          Detalles del Pedido #{{ request.RequestID }}
        </h1>

        <!-- Información general -->
        <section class="general-info">
          <h2>
            <Icon-Iconify class="icon" icon="ic:twotone-info" /> Información
            General
          </h2>
          <div class="info-general">
            <p>
              <strong>Estado Actual: </strong
              >{{ lastRequestState(request)?.Name || "Sin estado" }}
            </p>
            <p><strong>Prioridad:</strong> {{ request.Priority_Name }}</p>
            <p><strong>Tipo de Pago:</strong> {{ request.PaymentType_Name }}</p>
            <p>
              <strong>Pedido para:</strong>
              {{ formatDate(request.RequestedToDate) }}
            </p>
            <p>
              <strong>Fecha de Solicitud:</strong>
              {{ formatDate(request.RequestedDate) }}
            </p>
            <p>
              <strong>Total Productos:</strong> {{ request.Products.length }}
            </p>
            <p>
              <strong>Tipo de Pedido:</strong> {{ request.RequestType_Name }}
            </p>
          </div>
        </section>

        <!-- Productos del pedido -->
        <section class="products-section">
          <h2>
            <Icon-Iconify class="icon" icon="ic:twotone-local-shipping" />
            Productos Solicitados
          </h2>
          <div class="product-list">
            <div
              class="product"
              v-for="product in request.Products"
              :key="product.ProductID"
            >
              <div class="product-image-wrapper">
                <img
                  :src="
                    product.Images[0]?.ImageUrl ||
                    'https://via.placeholder.com/150'
                  "
                  alt="Imagen del Producto"
                  class="product-image"
                />
              </div>
              <div class="product-info">
                <p><strong>Nombre:</strong> {{ product.Name }}</p>
                <p><strong>Cantidad:</strong> {{ product.Quantity }}</p>
                <p><strong>Precio:</strong> ${{ product.Price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Línea de tiempo de estados -->
        <section class="timeline-section">
          <h2>
            <Icon-Iconify class="icon" icon="ic:twotone-timeline" /> Cronología
            de Estados
          </h2>
          <div class="timeline">
            <div
              class="timeline-item"
              v-for="state in request.RequestStates"
              :key="state.RequestStateID"
            >
              <p class="timeline-date">{{ formatDate(state.UpdateDate) }}</p>
              <p class="timeline-status">{{ state.Name }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Sin detalles del pedido -->
      <div v-else class="no-orders">
        <p>No se encontraron detalles para este pedido.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequestById } from "../../services/requestService";

export default {
  name: "OrderDetails",
  data() {
    return {
      request: null, // Información del pedido
      loading: true, // Estado de carga
      error: null, // Mensaje de error
    };
  },
  async created() {
    const requestId = this.$route.params.id; // Obtiene el ID del pedido desde la ruta
    try {
      const response = await getRequestById(requestId);
      console.log("response request: ", response);
      if (response.status) {
        this.request = response.data; // Asigna los datos del pedido
      } else {
        console.error(
          "Error al obtener los detalles del pedido:",
          response.msg
        );
        this.error = response.msg || "Error desconocido al cargar el pedido.";
      }
    } catch (err) {
      console.error("Error al obtener los detalles del pedido:", err.message);
      this.error = err.message || "Error de red o problema desconocido.";
    } finally {
      this.loading = false; // Finaliza el estado de carga
    }
  },
  methods: {
    goBack(){
      this.$router.push("/requests/list");
    },
    lastRequestState(order) {
      console.log("lastRequestState order: ", order);
      return order.RequestStates.at(-1) || null; // Devuelve el último estado o null si no hay elementos
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
  },
};
</script>

<style scoped>
.icon-button{
  /* margin: 60px 0px 0px 0px; */
  all: unset;
  cursor: pointer; /* Opcional, para mantener el comportamiento de clic */
}

.icon {
  width: 50px;
  height: 50px;
  color: #018c91;
}

.container {
  /* background-color: red; */
  display: flex;
}

.container-right {
  /* background-color: green; */
  width: 93%;
}

.container-left {
  /* background-color: rgb(152, 223, 52); */
  width: 7%;
  padding: 38px 0px 0px 0px;
}

/* Contenedor Principal */
.order-details {
  font-family: "Roboto", Arial, sans-serif;
  color: #444;
  padding: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
}

/* Título */
h1.order-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  color: #1eb2b8;
  margin-bottom: 1.5rem;
}

/* Información General */
.general-info {
  margin-bottom: 2rem;
}

.info-general {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Dos columnas */
  gap: 1rem; /* Espacio entre filas y columnas */
  padding: 1.5rem;
  background: #f3f4f6;
  border: 1px solid #dcdfe3;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-general p {
  margin: 0;
  font-size: 1rem;
  background: #fff;
  padding: 0.8rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Productos */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(33.333% - 1rem);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  text-align: center;
}

.product:hover {
  transform: translateY(-5px);
}

.product-image-wrapper {
  width: 100%;
  padding-top: 100%;
  position: relative;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

/* Línea de tiempo */
.timeline-section {
  margin-top: 2rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline-date {
  font-size: 0.9rem;
  color: #888;
}

.timeline-status {
  font-size: 1rem;
  font-weight: bold;
  color: #48bfce;
}

/* Responsividad */
@media (max-width: 768px) {
  .info-general {
    grid-template-columns: 1fr; /* Una columna en pantallas pequeñas */
  }

  .product {
    width: 80%; /* Productos más grandes en pantallas pequeñas */
  }
}
</style>
