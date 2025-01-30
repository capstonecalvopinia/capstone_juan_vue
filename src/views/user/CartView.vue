<template>
  <div class="cart-container">
    <div class="container">
      <div class="container-left">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
      </div>
      <div class="container-right">
        <h1 class="cart-title">Mi Carrito</h1>
        <div v-if="cart && cart.products?.length > 0" class="cart-content">
          <div class="cart-items">
            <div
              v-for="(product, index) in cart.products"
              :key="index"
              class="cart-item"
            >
              <div v-if="product.images">
                <img
                  :src="product.images[0].imageUrl"
                  alt="Product Image"
                  class="product-image"
                />
              </div>
              <div v-else>
                <img
                  :src="product.image"
                  alt="Product Image"
                  class="product-image"
                />
              </div>

              <div class="product-details">
                <h2 class="product-name">{{ product.name }}</h2>
                <p class="product-price">
                  Precio: ${{ product.price.toFixed(2) }}
                </p>
                <div class="product-quantity">
                  <button
                    @click="updateQuantity(index, product.quantity - 1)"
                    class="quantity-btn"
                  >
                    -
                  </button>
                  <span>{{ product.quantity }}</span>
                  <button
                    @click="updateQuantity(index, product.quantity + 1)"
                    class="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <button @click="removeProduct(index)" class="remove-btn">
                Eliminar
              </button>
            </div>
          </div>
          <div class="cart-summary">
            <h2>Resumen</h2>
            <p>Subtotal: ${{ calculateTotal().toFixed(2) }}</p>
            <p>Continúa para ingresar tus datos de entrega</p>
            <button @click="checkout" class="checkout-btn">
              Continuar compra
            </button>
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

    <!-- Sugerencias de productos en base al carrito -->
    <!-- Suggestions -->
    <section class="suggestions">
      <h2>Recomendaciones</h2>

      <!-- Product Grid -->
      <div class="items-grid">
        <div
          class="item"
          v-for="(item, index) in suggestionsList"
          :key="index"
          @click="viewProduct(item.ProductID)"
        >
          <img class="card-image" :src="item.Image" :alt="item.Name" />
          <div class="item-info">
            <h3>{{ item.Name }}</h3>
            <p>{{ item.Description }}</p>
            <h3>{{ item.Price }}$ - {{ item.UnitShortName }}</h3>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
//onBeforeUpdate
import { ref, onMounted } from "vue";
import { useCartStore } from "@/pluggins/stores/cartStore.js";

import { getCartRecommendations } from "../../services/recommendationService.js";

export default {
  name: "CartView",
  setup() {
    const cartStore = useCartStore();
    const cart = ref(null);
    const suggestionsList = ref([]); // Hacer que suggestionsList sea reactivo

    const updateCart = () => {
      cart.value = cartStore.getCart;
      console.log("updateCart cart.value: ", cart.value);
    };

    const updateQuantity = (index, quantity) => {
      if (quantity <= 0) {
        removeProduct(index);
        return;
      }
      cart.value.products[index].quantity = quantity;
      cartStore.setCart(cart.value);
    };

    // const removeProduct = (index) => {
    //   cart.value.products.splice(index, 1);
    //   cartStore.setCart(cart.value);
    // };
    const removeProduct = (index) => {
      const product = cart.value.products[index];
      if (!product) return;

      const totalToSubtract = product.quantity * product.price;
      cart.value.Total -= totalToSubtract; // Restar el monto del producto eliminado

      cart.value.products.splice(index, 1);

      console.log("car a enviar: ", cart);
      cartStore.setCart(cart.value);
    };

    const calculateTotal = () => {
      console.log("cart calculateTotal: ", cart.value);
      return cart.value.products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    };

    const checkout = () => {
      // alert("¡Gracias por tu compra! Procesando el pago...");
      window.location.assign("/PurchaseView"); // Redirección nativa como fallback

      cart.value = cartStore.getCart;
    };

    const getRecommendations = async () => {
      let productIds = [];
      console.log("cart.value onMounted: ", cart.value.products);
      cart.value.products.forEach((product) => {
        productIds.push({ product_id: product.productID });
      });
      try {
        let recommendations = await getCartRecommendations({
          cart_data: productIds,
        });
        console.log("recommendations: ", recommendations);

        // Asignar los productos sugeridos a suggestionsList
        if (recommendations.status && recommendations.data) {
          suggestionsList.value =
            recommendations.data.productsInfo.products || [];
        } else {
          console.error(
            "Error al obtener recomendaciones: ",
            recommendations.msg
          );
        }
      } catch (error) {
        console.error("Error en getRecommendations: ", error);
      }
    };

    onMounted(async () => {
      updateCart();
      await getRecommendations();
    });

    console.log("cart CartView Setup: ", cart);
    console.log("suggestionsList22: ", suggestionsList);

    return {
      cart,
      updateQuantity,
      removeProduct,
      calculateTotal,
      checkout,
      suggestionsList, // Retornar suggestionsList para usar en el componente
    };
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    viewProduct(productId) {
      this.$router.push({
        name: "ProductDetails",
        params: { id: productId, backRoute: "/cart" },
      });
    },
  },
};
</script>

<style scoped>
.card-image {
  width: auto; /* El ancho de la imagen ocupa todo el ancho del contenedor */
  height: 150px; /* Altura fija para la imagen */
  object-fit: cover;
}

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
  padding: 10px 0px 0px 0px;
}

.suggestions {
  margin: 40px 0;
  text-align: center;
}

.suggestions h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.item {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.item:hover {
  transform: translateY(-5px);
  cursor: pointer;
}

.item-info {
  padding: 15px;
  text-align: left;
}

.item-info h3 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
}

.item-info p {
  font-size: 0.9em;
  color: #666;
}

.cart-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}
.cart-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}
.cart-content {
  display: flex;
  justify-content: space-between;

  gap: 20px;
}
.cart-items {
  flex: 2;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}
.product-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
}
.product-details {
  flex: 1;
}
.product-name {
  font-size: 1.2rem;
  margin: 0;
}
.product-price {
  color: #888;
}
.product-quantity {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.quantity-btn {
  background: #f0f0f0;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.quantity-btn:hover {
  background: #ddd;
}
.remove-btn {
  background: #b81908;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
}
.remove-btn:hover {
  background: rgb(112, 25, 16);
}
.cart-summary {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-summary h2 {
  margin-bottom: 15px;
}

.checkout-btn {
  /* width: 100%;
  padding: 10px;
  background: #28a745;
  color: #fff;
  border: none;
  font-size: 1rem;
  cursor: pointer; */

  width: 100%;
  padding: 10px;
  background-color: #018c91;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.checkout-btn:hover {
  background-color: #016e71;
}
.empty-cart {
  text-align: center;
}
.browse-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #48bfce;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}
.browse-btn:hover {
  background: rgb(60, 174, 189);
}
</style>
