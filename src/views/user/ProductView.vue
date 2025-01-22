<template>
  <div class="container">
    <div class="container-left">
      <button class="icon-button" @click="goBack()">
        <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
      </button>
    </div>
    <div class="container-right">
      <div class="product-details-container">
        <!-- Cargando -->
        <div v-if="loading" class="loading">
          <p>Cargando información del producto...</p>
        </div>

        <!-- Información del producto -->
        <div v-else-if="product" class="product-details">
          <div class="product-image">
            <img :src="product.Image || defaultImage" :alt="product.Name" />
          </div>
          <div class="product-info">
            <h1>{{ product.Name }}</h1>
            <p class="product-description">{{ product.Description }}</p>
            <p class="product-price">{{ product.Price }} $</p>
            <p class="product-stock">
              <span v-if="product.Stock > 0"
                >En stock: {{ product.Stock }} {{ product.UnitShortName }}</span
              >
              <span v-else class="out-of-stock">Sin stock</span>
            </p>

            <!-- Formulario para agregar al carrito -->
            <form @submit.prevent="addToCart" class="formAdd">
              <label for="quantity">Cantidad:</label>
              <input
                id="quantity"
                type="number"
                v-model.number="quantity"
                :min="1"
                :max="product.Stock"
                :disabled="product.Stock <= 0"
              />
              <button
                type="submit"
                class="add-to-cart"
                :disabled="product.Stock <= 0 || quantity < 1"
              >
                Agregar al carrito
              </button>
            </form>

            <!-- Botón Comprar ahora -->
            <!-- <button class="buy-now" :disabled="product.Stock <= 0">
          Comprar ahora
        </button> -->
          </div>
        </div>

        <!-- Error -->
        <div v-else class="error">
          <p>No se pudo cargar la información del producto.</p>
        </div>
      </div>

      <!-- Suggestions -->
      <section class="popular">
        <h2>Recetas Relacionadas</h2>
        <!-- Product Grid -->
        <div class="items-grid">
          <div
            class="item"
            v-for="(item, index) in suggestionsList"
            :key="index"
            @click="viewRecipe(item)"
          >
            <img class="card-image" :src="item.ImageUrl" :alt="item.Name" />
            <div class="item-info">
              <h3>{{ item.Name }}</h3>
              <p>{{ item.Description }}</p>
              <h3>
                {{ item.Portions }} Porciones -
                {{ item.CookingTime + item.PreparationTime }}mins
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { fetchProductById } from "../../services/productService.js";
import { useCartStore } from "../../pluggins/stores/cartStore.js";
import { useUserStore } from "@/pluggins/stores/userStore.js";
import { createCart } from "../../services/cartService.js";
import { getRecipeRecommendations } from "../../services/recommendationService.js";
import Swal from "sweetalert2"; // Importación correcta
export default {
  name: "ProductDetails",
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      quantity: 1, // Cantidad inicial para agregar al carrito
      defaultImage:
        "https://via.placeholder.com/300x300.png?text=Producto+sin+imagen",
      suggestionsList: [],
      backRoute: "",
    };
  },
  async created() {
    const productId = this.$route.params.id;
    this.backRoute = this.$route.params.backRoute;
    console.log("this.backRoute: ", this.backRoute);
    try {
      this.product = await fetchProductById(productId);
      console.log("this.product: ", this.product);
      this.product = this.product.product;
      this.loading = false;
      const productData = {
        product_id: 1, // Producto de interés
      };
      //Cargar recomendaciones de recetas
      console.log("Cargando recomendaciones");
      const resRecRecipes = await getRecipeRecommendations(productData);
      console.log("resRecRecipes: ", resRecRecipes);
      if (resRecRecipes.status) {
        this.suggestionsList = resRecRecipes.data.recipeInfo.recipes;
        console.log("this.suggestionsList: ", this.suggestionsList);
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      this.error = error.message;
      this.loading = false;
    }
  },
  methods: {
    viewRecipe(recipe) {
      console.log("recipe to view: ", recipe);
      console.log("this.product: ", this.product);
      // this.$router.push({ name: "ProductDetails", params: { id: productId } });
      this.$router.push({
        name: "RecipeDetail",
        params: {
          recipe: JSON.stringify(recipe),
          originalProduct: this.product.ProductID,
        },
      });
    },
    goBack() {
      if (this.backRoute.includes("RecipeID")) {
        //Proviene del RecipeDetailView
        let object = this.backRoute.slice(8);
        object = object.slice(0, -2);
        // Convertir JSON a objeto
        object = JSON.parse(object);
        console.log("object: ", object);

        const last = this.backRoute.slice(-1);
        this.$router.push({
          name: "RecipeDetail",
          params: {
            recipe: JSON.stringify(object),
            originalProduct: last,
          },
        });
      } else {
        console.log("this.backRoute in product View: ", this.backRoute);
        this.$router.push(this.backRoute);
      }
    },
    async submitCart() {
      const cartStore = useCartStore();
      const userStore = useUserStore();

      // Actualiza el carrito en el store
      //cartStore.setCart(cart.value);
      const cart = cartStore.getCart;
      console.log("cart: ", cart);
      const user = userStore.getUser;
      console.log("userrrrreeeloca: ", user);

      // Obtén la fecha actual en formato "YYYY-MM-DD"
      const currentDate = new Date().toISOString().split("T")[0];

      // Guarda la fecha actual en cart.requestedDate
      cart.requestedDate = currentDate;

      const cartToSend = {
        UserID: user.userID,
        PriorityID: cart.priorityID != "" ? cart.priorityID : 1,
        PriorityReason: cart.PriorityReason ? cart.PriorityReason : " ",
        RequestTypeID: cart.requestTypeID != "" ? cart.requestTypeID : 1,
        RequestStateID: 1,
        PaymentTypeID: cart.paymentTypeID != "" ? cart.paymentTypeID : 1, //revisar
        PaymentStateID: 1, //revisar que exista en la bdd
        Address: cart.address,
        RequestedDate: cart.requestedDate,
        RequestedToDate: cart.requestedToDate,
        DeliveredDate: null,
        Products: cart.products,
      };
      console.log("cartToSend: ", cartToSend);

      const resCreateCart = await createCart(cartToSend);
      console.log("resCreateCart: ", resCreateCart);
      // Muestra el mensaje de éxito
      await Swal.fire({
        title: "El carrito se ha actualizado exitosamente.",
        icon: "success",
        text: "Los datos de envío han sido guardados.",
      });

      //cartStore.clearCart();
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
.popular {
  margin: 40px 0;
  text-align: center;
}

.popular h2 {
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
  padding: 38px 0px 0px 0px;
}

.product-details-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: Arial, sans-serif;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  color: #555;
}

.product-details {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
}

.product-image img {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
}

.product-info {
  flex: 1;
}

.product-info h1 {
  font-size: 28px;
  color: #333;
}

.product-description {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

.product-price {
  font-size: 22px;
  color: #007bff;
  margin: 15px 0;
}

.product-stock {
  font-size: 14px;
  margin-bottom: 20px;
}

.product-stock .out-of-stock {
  color: red;
}

.buy-now {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buy-now:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.buy-now:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Estilos generales para el formulario */
.formAdd {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #fdfcfc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;

  text-align: center;
  padding: 20px 25%;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background-color: #018c91;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
