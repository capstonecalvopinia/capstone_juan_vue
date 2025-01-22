<template>
  <div class="order-history">
    <!-- Cargando -->
    <div v-if="loading" class="loading">
      <p>Cargando historial de pedidos...</p>
    </div>

    <!-- Lista de pedidos -->
    <div v-else-if="orders.length" class="orders-list">
      <h1>Historial de Pedidos</h1>
      <div v-for="order in orders" :key="order.RequestID" class="order-item">
        <!-- Encabezado del pedido -->
        <div class="order-header">
          <div class="order-id">
            <p>Pedido #{{ order.RequestID }}</p>
            <Icon-Iconify class="icon" icon="ic:twotone-local-shipping" />
          </div>
          <div class="order-date">
            <p>{{ formatDate(order.RequestedDate) }}</p>
          </div>
        </div>
        <!-- Resumen del pedido -->
        <div class="order-body">
          <div class="order-details">
            <p>
              <strong>Estado:</strong>
              {{ lastRequestState(order)?.Name || "Sin estado" }}
            </p>
            <p><strong>Prioridad:</strong> {{ order.Priority_Name }}</p>
            <p><strong>Tipo de Pago:</strong> {{ order.PaymentType_Name }}</p>
            <p><strong>Estado del Pago:</strong> {{ order.PaymentState_Name }}</p>
          </div>
          <div class="order-info">
            <p>
              <strong>Pedido para:</strong>
              {{ formatDate(order.RequestedToDate) }}
            </p>
            <p><strong>Total Productos:</strong> {{ order.Products.length }}</p>
            <p><strong>Tipo de Pedido:</strong> {{ order.RequestType_Name }}</p>
          </div>
        </div>
        <!-- Productos del pedido -->
        <div class="order-products">
          <hr class="divider" />
          <div class="product-list">
            <img
              v-for="product in order.Products"
              :key="product.ProductID"
              :src="product.Images[0].ImageUrl"
              alt="Product Image"
              class="product-image"
            />
          </div>
        </div>
        <!-- Botón de acción -->
        <div class="order-actions">
          <button v-if="order.PaymentTypeID != 3 && order.PaymentState_Name != 'Pago Exitoso'" @click="navigateToPaymentTutorial(order.RequestID, order.PaymentType_Name)" class="view-details-button">
            Ver Indicaciones de Pago
          </button>
          <button @click="repeatOrder(order)" class="view-details-button">
            Repetir Pedido
          </button>
          <button @click="viewOrderDetails(order)" class="view-details-button">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>

    <!-- Sin pedidos -->
    <div v-else class="no-orders">
      <p>No se encontraron pedidos para este usuario.</p>
    </div>
  </div>
</template>

<script>
import { getRequestsByUserId } from "../../services/requestService";
import { useUserStore } from "../../pluggins/stores/userStore.js";
import { useCartStore } from "../../pluggins/stores/cartStore.js";
import { createCart } from "../../services/cartService.js";
import Swal from "sweetalert2";

export default {
  name: "OrderHistory",
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
      user: null,
    };
  },
  async created() {
    const userStore = useUserStore();
    this.user = userStore.getUser;

    const userId = this.user.userID;
    try {
      const response = await getRequestsByUserId(userId);

      console.log("response in created: ", response);
      if (response.status) {
        this.orders = response.data;
        this.orders.sort((a, b) => b.RequestID - a.RequestID);

      } else {
        console.error("Error fetching orders:", response.msg);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    navigateToPaymentTutorial(newRequestID, newPaymentType){
      //this.$router.push("/requests/list");
      this.$router.push(`/paymentTutorial/${newRequestID}/${newPaymentType}`);
    },

    lastRequestState(order) {
      console.log("lastRequestState order: ");
      return order.RequestStates.at(-1) || null; // Devuelve el último estado o null si no hay elementos
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
    viewOrderDetails(order) {
      console.log("order to view: ", order);
      this.$router.push(`/requests/${order.RequestID}`);
    },
    transformKeys(array) {
      return array.map((item) => {
        const newItem = {};
        for (const key in item) {
          // Convierte la primera letra a minúscula y conserva el resto
          const newKey = key.charAt(0).toLowerCase() + key.slice(1);
          newItem[newKey] = item[key];
        }
        return newItem;
      });
    },
    transformImagesKeys(array) {
      return array.map((item) => {
        const newItem = {};

        for (const key in item) {
          // Convierte la primera letra de la clave a minúscula
          const newKey = key.charAt(0).toLowerCase() + key.slice(1);

          if (newKey === "images" && Array.isArray(item[key])) {
            // Si el atributo es "images" y es un arreglo, transforma las claves de sus objetos
            newItem[newKey] = item[key].map((image) => {
              const newImage = {};
              for (const imgKey in image) {
                const newImgKey =
                  imgKey.charAt(0).toLowerCase() + imgKey.slice(1);
                newImage[newImgKey] = image[imgKey];
              }
              return newImage;
            });
          } else {
            // Copia los valores para las demás claves
            newItem[newKey] = item[key];
          }
        }

        return newItem;
      });
    },

    async repeatOrder(order) {
      console.log("repeatOrder: ", order);
      const cartStore = useCartStore();

      // Obtén la fecha actual en formato "YYYY-MM-DD"
      const currentDate = new Date().toISOString().split("T")[0];

      let cartToSend = {
        UserID: order.User_UserID,
        PriorityID: order.PriorityID != "" ? order.PriorityID : 1,
        PriorityReason: order.PriorityReason ? order.PriorityReason : " ",
        RequestTypeID: order.RequestTypeID != "" ? order.RequestTypeID : 1,
        RequestStateID: 1,
        PaymentTypeID: order.PaymentTypeID != "" ? order.PaymentTypeID : 1, //revisar
        PaymentStateID: 1, //revisar que exista en la bdd
        Address: order.Address,
        RequestedDate: currentDate,
        RequestedToDate: null,
        DeliveredDate: null,
        Products: this.transformKeys(order.Products),
        //order.RequestedToDate
      };

      const resCreateCart = await createCart(cartToSend);
      console.log("resCreateCart in repeatOrder: ", resCreateCart);

      (cartToSend.products = this.transformImagesKeys(cartToSend.Products)),
        console.log("cartToSend: ", cartToSend);

      cartStore.setCart(cartToSend);
      // Muestra el mensaje de éxito
      await Swal.fire({
        title: "¡Órden agregada al carrito!",
        icon: "success",
        text: "Los datos de la orden seleccionada se han cargado al carrito actual, modificalo en la sección del carrito e inicia tu nuevo pedido desde allí.",
      });

      this.$router.push(`/cart`);
    },
    async addToCart() {
      console.log("add to cart");
      const cartStore = useCartStore();

      // Producto a agregar al carrito
      const productToAdd = {
        productID: this.product.ProductID,
        name: this.product.Name,
        price: this.product.Price,
        quantity: this.quantity,
        image: this.product.Image,
      };

      cartStore.addProduct(productToAdd);

      this.submitCart();

      await this.$swal({
        title: "El producto se agregó exitosamente al carrito.",
        icon: "success",
        text: "Puedes ver el detalle en el carrito.",
      });

      // alert(`${this.quantity} ${this.product.Name}(s) agregado(s) al carrito.`);
    },
  },
};
</script>

<style scoped>
.order-history {
  font-family: "Roboto", Arial, sans-serif;
  color: #444;
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  background: #f9fafc;
  border-radius: 12px;
}

h1 {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  color: #1eb2b8;
  margin-bottom: 2rem;
}

.loading,
.no-orders {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-item {
  background: #fff;
  border: 1px solid #e3e6eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e3e6eb;
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;
}

.order-id {
  display: flex;
  font-size: 1rem;
  font-weight: bold;
  color: #444;
  justify-content: center;
  align-items: center;
}

.order-id p {
  margin-right: 10px;
}

.order-date {
  font-size: 0.9rem;
  color: #777;
}

.order-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.order-details p,
.order-info p {
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.order-details strong,
.order-info strong {
  color: #48bfce;
}

.order-actions {
  text-align: right;
  margin-top: 1rem;
}

.view-details-button {
  background: #018c91;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-right: 20px;
}

.view-details-button:hover {
  background: #1c696c;
  transform: scale(1.05);
}

.product-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-top: 1rem;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .order-body {
    grid-template-columns: 1fr;
  }

  .product-image {
    width: 50px;
    height: 50px;
  }
}
</style>
