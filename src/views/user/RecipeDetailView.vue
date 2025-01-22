<template>
  <div class="container">
    <div class="container-left">
      <button class="icon-button" @click="goBack()">
        <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
      </button>
    </div>
    <div class="container-right">
      <div class="recipe-detail-container" v-if="recipe">
        <div class="recipe-header">
          <div class="recipe-image-container">
            <img
              :src="recipe.ImageUrl"
              alt="Imagen de la receta"
              class="recipe-image"
            />
          </div>
          <div class="recipe-info">
            <h1 class="recipe-title">{{ recipe.Name }}</h1>
            <p class="recipe-description">{{ recipe.Description }}</p>
            <div class="recipe-stats">
              <div class="recipe-stat">
                <span class="stat-label">Tiempo de preparación:</span>
                <span>{{ recipe.PreparationTime }} min</span>
              </div>
              <div class="recipe-stat">
                <span class="stat-label">Tiempo de cocción:</span>
                <span>{{ recipe.CookingTime }} min</span>
              </div>
              <div class="recipe-stat">
                <span class="stat-label">Porciones:</span>
                <span>{{ recipe.Portions }}</span>
              </div>
              <div class="recipe-stat">
                <span class="stat-label">Calorías:</span>
                <span>{{ recipe.Calories }} kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div class="recipe-quantity">
          <p><strong>Cantidad:</strong> {{ recipe.Quantity }}</p>
        </div>

        <!-- Mostrar los pasos de la receta de forma visual -->
        <div class="recipe-steps" v-if="steps.length">
          <h2>Paso a paso:</h2>
          <div class="steps-container">
            <div v-for="(step, index) in steps" :key="index" class="step-card">
              <div class="step-header">
                <span class="step-number">Paso {{ step.NumberOfStep }}</span>
                <h3 class="step-title">{{ step.Name }}</h3>
              </div>
              <p class="step-description">{{ step.Description }}</p>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <section class="popular">
          <h2>Productos Asociados</h2>
          <!-- Product Grid -->
          <div class="items-grid">
            <div
              class="item"
              v-for="(item, index) in productsList"
              :key="index"
              @click="viewProduct(item.ProductID)"
            >
              <img
                class="card-image"
                :src="item.ProductImageUrl"
                :alt="item.ProductName"
              />
              <div class="item-info">
                <h3>{{ item.ProductName }}</h3>
                <p>{{ item.ProductDescription }}</p>
                <h3>{{ item.ProductPrice }}$</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div v-else class="loading-message">Cargando...</div>
    </div>
  </div>

  <!-- Muestra un mensaje mientras los datos no estén disponibles -->
</template>

<script>
import { fetchStepsByRecipeId } from "../../services/stepsService.js";
import { fetchProductsForRecipe } from "../../services/productRecipeService.js";
export default {
  name: "RecipeDetail",
  data() {
    return {
      recipe: null, // Inicializamos como null
      steps: [],
      productsList: [],
      originalProduct: {}
    };
  },
  methods: {
    viewProduct(productId) {
      // this.$router.push({
      //   name: "RecipeDetail",
      //   params: {
      //     recipe: JSON.stringify(recipe),
      //     originalProduct: this.product.ProductID
      //   },
      // });

      let back = JSON.stringify(this.recipe);
      back = "/recipe/"+back+"/"+this.originalProduct;
      //let back = JSON.stringify(this.recipe+"/"+originalProduct)
      console.log("back: ", back);
      this.$router.push({ name: "ProductDetails", params: { id: productId, backRoute: back  } });
    },
    goBack() {
      this.$router.push({ name: "ProductDetails", params: { id: this.originalProduct, backRoute: "/" } });
      // this.$router.push("/product/details/"+this.originalProduct+"//");
    },
  },
  async mounted() {
    try {
      // Recibir los datos de la receta a través de los parámetros de la ruta
      const recipeData = this.$route.params.recipe;
      this.originalProduct = this.$route.params.originalProduct;
      if (recipeData) {
        this.recipe = JSON.parse(recipeData); // Convertimos la cadena JSON en un objeto
      }

      // Cargar los pasos relacionados con la receta
      const response = await fetchStepsByRecipeId(this.recipe.RecipeID);
      if (response.status) {
        this.steps = response.data;
      } else {
        console.error("Error al obtener los pasos: ", response.msg);
      }

      console.log("this.recipe.RecipeID: ", this.recipe.RecipeID);
      const responseProducts = await fetchProductsForRecipe(
        this.recipe.RecipeID
      );
      console.log("responseProducts: ", responseProducts);
      this.productsList = responseProducts.data;
      console.log(" this.productsList: ", this.productsList);
    } catch (error) {
      console.error("Error al cargar los datos: ", error);
    }
  },
};
</script>

<style scoped>
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

.card-image {
  width: auto; /* El ancho de la imagen ocupa todo el ancho del contenedor */
  height: 150px; /* Altura fija para la imagen */
  object-fit: cover;
}

.container {
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
}

.shop-now {
  background-color: #ffa500;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
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

/* Estilos generales */
.recipe-detail-container {
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
  font-family: "Roboto", sans-serif;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Estilo del header de la receta */
.recipe-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.recipe-image-container {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
}

.recipe-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.recipe-info {
  max-width: 800px;
}

.recipe-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.recipe-description {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.recipe-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.recipe-stat {
  font-size: 16px;
  color: #444;
}

.stat-label {
  font-weight: bold;
  color: #333;
}

.recipe-quantity {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 20px;
}

.recipe-quantity p {
  font-size: 18px;
  font-weight: 600;
  color: #444;
}

/* Estilos para los pasos de la receta */
.recipe-steps {
  margin-top: 30px;
}

.steps-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.step-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.step-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.step-number {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #444;
}

.step-description {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  text-align: left; /* Alineación a la izquierda */
}

/* Responsividad */
@media (max-width: 768px) {
  .recipe-header {
    flex-direction: column;
    text-align: center;
  }

  .recipe-image {
    height: 250px;
    object-fit: cover;
    margin-bottom: 20px;
  }

  .recipe-stats {
    grid-template-columns: 1fr;
  }

  .recipe-info {
    text-align: center;
  }

  .steps-container {
    grid-template-columns: 1fr;
  }
}

.loading-message {
  text-align: center;
  font-size: 20px;
  color: #999;
}
</style>
