<template>
  <div class="container">
    <div class="container-left">
      <button class="icon-button" @click="goBack()">
        <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
      </button>
    </div>
    <div class="container-right">
      <div class="cart-container">
        <h1 class="cart-title">Mi Carrito</h1>
        <div v-if="cart && cart.products?.length > 0" class="cart-content">
          <div class="cart-summary">
            <h2>Resumen</h2>
            <p>Subtotal: ${{ calculateTotal().toFixed(2) }}</p>
            <form @submit.prevent="submitCart">
              <label for="address">Dirección:</label>
              <input
                id="address"
                type="text"
                v-model="cart.address"
                placeholder="Ingresa tu dirección"
                required
              />

              <label for="requestedToDate">Fecha requerida hasta:</label>
              <input
                id="requestedToDate"
                type="date"
                v-model="cart.requestedToDate"
              />

              <label for="paymentTypeID">Tipo de pago:</label>
              <select id="paymentTypeID" v-model="cart.paymentTypeID" required>
                <option value="" disabled>Selecciona un tipo de pago</option>
                <option
                  :value="paymentType.PaymentTypeID"
                  v-for="paymentType in paymentTypes"
                  :key="paymentType.PaymentTypeID"
                >
                  {{ paymentType.Name }}
                </option>
              </select>

              <label for="priorityID">Prioridad:</label>
              <select id="priorityID" v-model="cart.priorityID" required>
                <option value="" disabled>Selecciona una prioridad</option>
                <option
                  :value="priority.PriorityID"
                  v-for="priority in priorities"
                  :key="priority.PriorityID"
                >
                  {{ priority.Name }}
                </option>
              </select>

              <label for="PriorityReason">Razón de la prioridad:</label>
              <input
                id="PriorityReason"
                type="text"
                v-model="cart.PriorityReason"
                placeholder="Ingresa por qué tu pedido es prioritario"
                required
              />

              <label for="requestTypeID">Método de Entrega:</label>
              <select id="requestTypeID" v-model="cart.requestTypeID" required>
                <option value="" disabled>
                  Selecciona un método de entrega
                </option>
                <option
                  :value="requestType.RequestTypeID"
                  v-for="requestType in requestTypes"
                  :key="requestType.Name"
                >
                  {{ requestType.Name }}
                </option>
              </select>

              <div v-if="cart.paymentTypeID == 3" class="paypalContainer">
                <h2>Completa tu pago | Paypal</h2>
                <p>Puedes usar los métodos de pago permitidos por Paypal.</p>
                <p>Una vez completado el pago podrás continuar.</p>
                <div id="paypal-button-container"></div>
                <p v-if="message">{{ message }}</p>
              </div>

              <button
                v-if="cart.requestTypeID != 3 || paypalPaymentState"
                type="submit"
                class="checkout-btn"
              >
                Confirmar compra
              </button>
              <button
                v-else-if="!paypalPaymentState"
                type="submit"
                class="checkout-btn-false"
                disabled
              >
                Confirmar compra
              </button>
              <button @click="CancelOrder" class="cancel-btn">Cancelar</button>
            </form>
          </div>
        </div>
        <div v-else class="empty-cart">
          <p>Tu carrito está vacío.</p>
          <router-link to="/" class="browse-btn"
            >Explorar productos</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/pluggins/stores/cartStore.js";
import { useUserStore } from "@/pluggins/stores/userStore.js";
import Swal from "sweetalert2"; // Importación correcta

import { getAllPaymentTypes } from "../../services/paymentTypeService.js";
import { getAllRequestTypes } from "../../services/requestTypeService.js";
import { fetchPriorities } from "../../services/priorityService.js";
import { createRequest, payWithPaypal } from "../../services/requestService.js";
import { deleteUserCart } from "../../services/cartService.js";

//Paypal Integration
import { loadScript } from "@paypal/paypal-js";
import { useRouter } from "vue-router";

export default {
  name: "CartView",
  data() {
    return {
      message: "",
      clientId:
        "AamU-mSOkBALOKcKs6lgG5yorNtspYEosln1f_VDADySM_RVuKPssZc0AKwgPiKSTp5hLaFp8t244yo4",
      amount: 1,
      paypalPaymentState: false,
    };
  },
  watch: {
    "cart.paymentTypeID"(newValue) {
      if (newValue === 3) {
        this.$nextTick(() => {
          this.initializePayPal();
        });
      }
    },
  },
  methods: {
    goBack() {
      this.$router.push("/cart");
    },
    CancelOrder() {
      this.$router.push("/");
    },

    async initializePayPal() {
      if (!document.getElementById("paypal-button-container")) {
        console.error(
          "El contenedor #paypal-button-container no está disponible en el DOM."
        );
        return;
      }

      try {
        // Carga el SDK de PayPal
        const paypal = await loadScript({
          "client-id": this.clientId,
          currency: "USD",
          components: "buttons",
        });

        if (!paypal) {
          this.message = "Error al cargar PayPal SDK.";
          return;
        }

        // Renderiza el botón de PayPal
        paypal
          .Buttons({
            style: {
              shape: "rect",
              layout: "vertical",
              color: "gold",
              label: "paypal",
            },
            createOrder: async () => {
              try {
                let API_URL = process.env.VUE_APP_API_URL;
                API_URL = API_URL + "/requests";

                const cartToSend = this.getFormattedCartToSend();
                const response = await fetch(API_URL + "/payWithPaypal", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cart: cartToSend,
                  }),
                });
                const orderData = await response.json();
                if (orderData.id) {
                  return orderData.id;
                } else {
                  throw new Error("Error al crear la orden en el servidor.");
                }
              } catch (error) {
                this.message = `Error al crear la orden: ${error.message}`;
                console.error(error);
              }
            },
            onApprove: async (data) => {
              try {
                let API_URL = process.env.VUE_APP_API_URL;
                API_URL = API_URL + "/requests";

                const response = await fetch(
                  API_URL + `/capturePaypalPayment/${data.orderID}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                const orderData = await response.json();
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                this.message = `Transacción completada: ${transaction.id}`;

                if (orderData.status == "COMPLETED") {
                  this.paypalPaymentState = true;
                  Swal.fire({
                    title: "!Éxito!",
                    icon: "success",
                    text: "El pago se ha realizado correctamente, ahora el proceso de compra se finalizará.",
                  });
                  this.submitCart(this.paypalPaymentState);
                } else {
                  this.paypalPaymentState = false;
                  Swal.fire({
                    title: "!Error!",
                    icon: "error",
                    text: "No hemos podido validar el pago.",
                  });
                }
              } catch (error) {
                this.message = `Error al procesar la transacción: ${error.message}`;
                console.error(error);
              }
            },
            onError: (err) => {
              this.message = "Error en el pago.";
              console.error("Error en PayPal Buttons:", err);
            },
          })
          .render("#paypal-button-container");
      } catch (error) {
        this.message = `Error inicializando PayPal: ${error.message}`;
        console.error(error);
      }
    },
  },
  async setup() {
    const router = useRouter(); // Declarar al inicio de setup
    const navigateToPaymentTutorial = (newRequestID, newPaymentType) => {
      console.log(
        "navigateToPaymentTutorial: " +
          "/paymentTutorial/" +
          newRequestID +
          "/" +
          newPaymentType
      );
      //this.$router.push(`/requests/${order.RequestID}`);
      router.push(`/paymentTutorial/${newRequestID}/${newPaymentType}`);
    };

    const cartStore = useCartStore();
    const userStore = useUserStore();
    const cart = ref(null);
    const user = ref(null);

    // Variable reactiva para guardar los tipos de pago
    const paymentTypes = ref([]);
    const requestTypes = ref([]);
    const priorities = ref([]);

    const loadPriorities = async () => {
      try {
        const prioritiesRes = await fetchPriorities();

        priorities.value = prioritiesRes.data;
      } catch (error) {
        console.error("Error al cargar las prioridades de entrega", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "No se pudieron cargar las prioridades de entrega.",
        });
      }
    };

    // Función para cargar los tipos de pago
    const loadPaymentTypes = async () => {
      try {
        const types = await getAllPaymentTypes();

        paymentTypes.value = types.data;
      } catch (error) {
        console.error("Error al cargar los tipos de pago:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "No se pudieron cargar los tipos de pago.",
        });
      }
    };

    const loadRequestsTypes = async () => {
      try {
        const requestTypesRes = await getAllRequestTypes();
        requestTypes.value = requestTypesRes.data;
      } catch (error) {
        console.error("Error al cargar los tipos de envío:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "No se pudieron cargar los tipos de envío.",
        });
      }
    };

    const updateCart = () => {
      cart.value = cartStore.getCart;
    };

    const updateUser = () => {
      user.value = userStore.getUser;
    };

    const updateQuantity = (index, quantity) => {
      if (quantity <= 0) {
        removeProduct(index);
        return;
      }
      cart.value.products[index].quantity = quantity;
      cartStore.setCart(cart.value);
    };

    const removeProduct = (index) => {
      cart.value.products.splice(index, 1);
      cartStore.setCart(cart.value);
    };

    const calculateTotal = () => {
      return cart.value.products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    };

    const getFormattedCartToSend = () => {
      // Obtén la fecha actual en formato "YYYY-MM-DD"
      const currentDate = new Date().toISOString().split("T")[0];

      // Guarda la fecha actual en cart.requestedDate
      cart.value.requestedDate = currentDate;

      // Actualiza el carrito en el store
      cartStore.setCart(cart.value);
      const savedCart = cartStore.getCart;
      const user = userStore.getUser;

      const cartToSend = {
        UserID: user.userID,
        UserEmail: user.email,
        PriorityID: savedCart.priorityID,
        PriorityReason: savedCart.PriorityReason,
        RequestTypeID: savedCart.requestTypeID,
        RequestStateID: 1,
        PaymentTypeID: savedCart.paymentTypeID, //revisar
        PaymentStateID: 1, //revisar que exista en la bdd
        Address: savedCart.address,
        RequestedDate: savedCart.requestedDate,
        RequestedToDate: savedCart.requestedToDate,
        DeliveredDate: null,
        Products: savedCart.products,
      };
      return cartToSend;
    };

    const submitCart = async (paypalPaymentState) => {
      // Muestra el loading de SweetAlert
      Swal.fire({
        title: "Procesando...",
        text: "Por favor espera mientras procesamos tu pedido.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Muestra el spinner
        },
      });

      try {
        // Obtén la fecha actual en formato "YYYY-MM-DD"
        const currentDate = new Date().toISOString().split("T")[0];

        // Guarda la fecha actual en cart.requestedDate
        cart.value.requestedDate = currentDate;

        // Actualiza el carrito en el store
        cartStore.setCart(cart.value);
        const savedCart = cartStore.getCart;
        const user = userStore.getUser;

        const cartToSend = {
          UserID: user.userID,
          UserEmail: user.email,
          PriorityID: savedCart.priorityID,
          PriorityReason: savedCart.PriorityReason,
          RequestTypeID: savedCart.requestTypeID,
          RequestStateID: 1,
          PaymentTypeID: savedCart.paymentTypeID, //revisar
          PaymentStateID: 1,
          Address: savedCart.address,
          RequestedDate: savedCart.requestedDate,
          RequestedToDate: savedCart.requestedToDate,
          DeliveredDate: null,
          Products: savedCart.products,
        };

        if (cartToSend.PaymentTypeID == 3 && paypalPaymentState) {
          cartToSend.PaymentStateID = 2;
          cartToSend.RequestStateID = 3;
        } else if (cartToSend.PaymentTypeID == 3 && !paypalPaymentState) {
          cartToSend.PaymentStateID = 3;
          cartToSend.RequestStateID = 4;
        } else {
          cartToSend.PaymentStateID = 1;
          cartToSend.RequestStateID = 2;
        }

        console.log("cartToSend: ", cartToSend);

        // Realiza las peticiones
        const resCreateRequest = await createRequest(cartToSend);
        console.log("user.userID: ", user.userID);
        await deleteUserCart(user.userID);
        console.log("resCreateRequest: ", resCreateRequest);

        // Cierra el loading
        Swal.close();

        // Muestra el mensaje de éxito
        await Swal.fire({
          title: "El carrito se ha actualizado exitosamente.",
          icon: "success",
          text: "Los datos de envío han sido guardados.",
        });

        if (cartToSend.PaymentTypeID != 3) {
          console.log("resCreateRequest: ", resCreateRequest.data);
          if (cartToSend.PaymentTypeID == 1) {
            // Efectivo
            navigateToPaymentTutorial(resCreateRequest.data, "Efectivo");
          } else if (cartToSend.PaymentTypeID == 2) {
            // Transferencia
            navigateToPaymentTutorial(resCreateRequest.data, "Transferencia");
          }
        } else {
          // Si el pago fue con tarjeta, y se completó correctamente, se envía a PurchaseView
          window.location.assign("/PurchaseView"); // Redirección nativa como fallback
        }

        cartStore.clearCart();
      } catch (error) {
        // Cierra el loading y muestra un mensaje de error en caso de fallo
        Swal.close();
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al procesar tu pedido. Por favor intenta nuevamente.",
          icon: "error",
        });
      }
    };

    const payWithPaypalMethod = async () => {
      // Obtén la fecha actual en formato "YYYY-MM-DD"
      const currentDate = new Date().toISOString().split("T")[0];

      // Guarda la fecha actual en cart.requestedDate
      cart.value.requestedDate = currentDate;

      // Actualiza el carrito en el store
      cartStore.setCart(cart.value);
      const savedCart = cartStore.getCart;
      const user = userStore.getUser;

      const cartToSend = {
        UserID: user.userID,
        PriorityID: savedCart.priorityID,
        PriorityReason: savedCart.PriorityReason,
        RequestTypeID: savedCart.requestTypeID,
        RequestStateID: 1,
        PaymentTypeID: savedCart.paymentTypeID, //revisar
        PaymentStateID: 1, //revisar que exista en la bdd
        Address: savedCart.address,
        RequestedDate: savedCart.requestedDate,
        RequestedToDate: savedCart.requestedToDate,
        DeliveredDate: null,
        Products: savedCart.products,
      };
      //console.log("cartToSend: ", cartToSend);

      await payWithPaypal(cartToSend);
      //console.log("paymentResponse: ", paymentResponse);
      //const resDeleteCart = await deleteUserCart(user.userID);

      //console.log("resDeleteCart: ", resDeleteCart);
      //console.log("resCreateRequest: ", resCreateRequest);
      // Muestra el mensaje de éxito
      await Swal.fire({
        title: "El carrito se ha actualizado exitosamente.",
        icon: "success",
        text: "Los datos de envío han sido guardados.",
      });

      //window.location.assign("/PurchaseView"); // Redirección nativa como fallback

      cartStore.clearCart();
    };

    // Carga inicial de datos al montar el componente
    onMounted(() => {
      updateCart();
      updateUser();
      loadPaymentTypes();
      loadRequestsTypes();
      loadPriorities();
    });

    return {
      cart,
      user,
      paymentTypes,
      requestTypes,
      priorities,
      updateQuantity,
      removeProduct,
      calculateTotal,
      submitCart,
      payWithPaypalMethod,
      getFormattedCartToSend,
      navigateToPaymentTutorial,
    };
  },
};
</script>

<style scoped>
.icon-button {
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
  padding: 40px 0px 0px 0px;
}
#paypal-button-container {
  width: 80%;
}

.paypalContainer {
  background-color: rgb(244, 245, 245);

  display: flex;
  width: 100%;

  flex-direction: column;
  align-items: center;

  padding: 50px 0px 50px 0px;
  margin: 20px 0px 20px 0px;
}

#paymentTypeID {
  color: black !important;
}
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Roboto", sans-serif;
  color: #333;
}

.cart-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #4caf50;
}

.cart-content {
  display: flex;
  gap: 20px;

  padding: 1% 5%;
}

.cart-items {
  flex: 2;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.product-price {
  color: #888;
  font-size: 1rem;
  margin-bottom: 10px;
}

.product-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.quantity-btn:hover {
  background-color: #45a049;
}

.cart-summary {
  flex: 1;
  background: #ffffff;
  border-radius: 8px;
  padding: 1% 10%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cart-summary h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #4caf50;
}

.cart-summary p {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #333;
}

form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

form input,
form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.checkout-btn {
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  width: 100%;
  padding: 10px;
  background-color: #018c91;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  width: 100%;
  padding: 10px;
  background-color: #d61414;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
}

.checkout-btn-false {
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  width: 100%;
  padding: 10px;
  background-color: #bcc1c2;
  color: white;
  border: none;
  border-radius: 4px;

  font-weight: bold;
}

.checkout-btn:hover {
  background-color: #016e71;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}
</style>
