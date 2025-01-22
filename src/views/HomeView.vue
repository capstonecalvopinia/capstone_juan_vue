<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="categories">
      <button id="category_all" @click="changeSelectedCategory('')">
        <Icon-Iconify class="icon" icon="bx:category-alt" />
        Todas Las Categorías
      </button>
      <button
        class="category"
        v-for="category in categories"
        :key="category.Name"
        @click="changeSelectedCategory(category.Name)"
      >
        {{ category.Name }}
      </button>
    </nav>
    <!-- Main Section -->
    <main>
      <!-- Banner -->
      <section class="banner" v-if="selectedCategory == ''">
        <!-- Texto promocional a la izquierda -->
        <div class="banner-text">
          <h2>
            Frescura y calidad en cada corte,<span> ¡sabor que conquista!</span>
          </h2>
          <p>Consiguelo en nuestra tienda</p>
        </div>

        <!-- Carrusel de imágenes a la derecha -->
        <div class="carousel">
          <div class="carousel-images">
            <img :src="images[currentImage]" alt="Promotional Image" />
          </div>
          <!-- Controles del carrusel -->
          <div class="carousel-controls">
            <button @click="prevImage">❮</button>
            <button @click="nextImage">❯</button>
          </div>
          <!-- Indicadores de puntos -->
          <div class="carousel-indicators">
            <span
              v-for="(image, index) in images"
              :key="index"
              :class="{ active: index === currentImage }"
              @click="goToImage(index)"
            ></span>
          </div>
        </div>
      </section>

      <!-- Suggestions -->
      <section class="popular">
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

      <!-- Popular Items -->
      <section class="popular">
        <h2>Tienda</h2>

        <!-- Search and Filter Section -->
        <div class="search-filter">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar productos..."
            class="search-input"
          />
          <select v-model="selectedCategory" class="filter-select">
            <option value="">Todas las Categorías</option>
            <option
              v-for="(category, index) in categories"
              :key="index"
              :value="category.Name"
            >
              {{ category.Name }}
            </option>
          </select>
        </div>

        <!-- Product Grid -->
        <div class="items-grid">
          <div
            class="item"
            v-for="(item, index) in filteredPopularItems"
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
    </main>
  </div>
</template>

<script>
import { fetchProducts } from "../services/productService.js";
import { useUserStore } from "../pluggins/stores/userStore.js";
import { getRecommendationsByPurchaseRecord } from "../services/recommendationService.js";
import { fetchCategories } from "../services/categoryService.js";

export default {
  name: "HomeView",
  data() {
    return {
      popularItems: [],
      categories: [
        // { name: "Carnes", link: "/" },
        // { name: "Res", link: "/" },
        // { name: "Cerdo", link: "/" },
        // { name: "Pollo", link: "/" },
        // { name: "Pescado", link: "/" },
      ],
      searchQuery: "",
      selectedCategory: "",
      images: [
        "https://www.shutterstock.com/image-photo/fresh-piece-beef-steak-rosemary-260nw-1920484757.jpg",
        "https://metro.co.uk/wp-content/uploads/2018/11/sei_38669555-3278.jpg?quality=90&strip=all",
        "https://static.wixstatic.com/media/aabb6a_3d033c85e65146e2899bf7297e4fa525~mv2.jpg",
      ],
      currentImage: 0,
      suggestionsList: [],
    };
  },
  computed: {
    filteredPopularItems() {
      //console.log("this.selectedCategory: ", this.selectedCategory);
      return this.popularItems.filter((item) => {
        //console.log("item selected: ", item);
        const matchesCategory =
          this.selectedCategory === "" ||
          item.categories[0].name === this.selectedCategory;
        const matchesSearch =
          this.searchQuery === "" ||
          item.Name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },
  },
  async mounted() {
    const userStore = useUserStore();

    this.user = userStore.getUser;
    console.log("mounted this.user: ", this.user);

    const productspre = await fetchProducts();
    this.popularItems = productspre;
    setInterval(this.nextImage, 3000);
    console.log("this.popularItems: ", this.popularItems);

    // Carga de las recomendaciones
    try {
      let recommendations = await getRecommendationsByPurchaseRecord({
        userId: this.user.userID,
        topN: 6,
      });
      //console.log("recommendations: ", recommendations);

      // Validación de recomendaciones
      if (
        recommendations?.data?.productsInfo?.products &&
        Array.isArray(recommendations.data.productsInfo.products)
      ) {
        this.suggestionsList = recommendations.data.productsInfo.products;
      } else {
        console.warn(
          "No se encontraron recomendaciones. Asignando una lista vacía."
        );
        this.suggestionsList = [];
      }
      //console.log("suggestionsList: ", this.suggestionsList);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      this.suggestionsList = []; // En caso de error, asignar lista vacía
    }

    //carga de las categorías
    try {
      this.categories = await fetchCategories();
      this.categories = this.categories.data;
      //Excluir categorías vacías conocidas
      // Filtrar las categorías que tienen productos asociados
      const filteredCategories = this.categories.filter((category) => {
        return this.popularItems.some(
          (item) =>
            item.categories &&
            item.categories.some((cat) => cat.name === category.Name)
        );
      });

      // Asignar el resultado filtrado a this.categories si deseas actualizarlo
      this.categories = filteredCategories;

      //console.log("await this.categories: ", this.categories);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  },

  methods: {
    viewProduct(productId) {
      this.$router.push({ name: "ProductDetails", params: { id: productId, backRoute:"/" } });
    },
    changeSelectedCategory(category) {
      //console.log("select category: ", category);
      this.selectedCategory = category;
    },
    assignRandomImageToProducts(stringsArray, productsArray) {
      if (stringsArray.length === 0 || productsArray.length === 0) {
        console.error("Los arreglos no deben estar vacíos");
        return;
      }
      productsArray.forEach((product) => {
        const randomIndex = Math.floor(Math.random() * stringsArray.length);
        product.Image = stringsArray[randomIndex];
      });
      return productsArray;
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.images.length;
    },
    prevImage() {
      this.currentImage =
        (this.currentImage - 1 + this.images.length) % this.images.length;
    },
    goToImage(index) {
      this.currentImage = index;
    },
  },
};
</script>

<style scoped>
.card-image {
  width: auto;        /* El ancho de la imagen ocupa todo el ancho del contenedor */
  height: 150px;      /* Altura fija para la imagen */
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

.search-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
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

/* .item img {
  width: 100%;
  height: auto;
} */

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

.banner {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 20px;

  border-radius: 10px;
  width: 97%;
  height: 260px;
}

.banner-text {
  padding: 20px;
  background-color: #f2f9fa;
  border-radius: 10px;
  color: #333;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}

.banner-text h2 {
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.banner-text h2 span {
  color: #018c91;
}

.banner-text p {
  color: #018c91;
}

.shop-now {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #018c91;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.carousel {
  position: relative;

  border-radius: 10px;
  overflow: hidden;

  width: 60%;
  height: 300px;
}

.carousel-images img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-controls button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.carousel-indicators .active {
  background-color: #ffa500;
}
</style>
