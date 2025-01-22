<template>
  <div class="manage-products">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewProducts'">Ver Productos</li>
        <li @click="currentView = 'addProduct'">Añadir Nuevo Producto</li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
        <h1>Gestión de Productos</h1>
        <p>Administra y configura los productos de la tienda</p>
      </header>

      <!-- Vista para ver y gestionar productos -->
      <section v-if="currentView === 'viewProducts'" class="product-list">
        <h2>Productos Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Unidad</th>
              <th>¿Disponible?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.ProductID">
              <td>{{ product.ProductID }}</td>
              <td>{{ product.Name }}</td>
              <td>${{ product.Price }}</td>
              <td>{{ product.Stock }}</td>
              <td>{{ product.UnirShortName }}</td>

              <td v-if="product.IsAvailable == true">Sí</td>
              <td v-if="product.IsAvailable != true">No</td>
              <td class="btns">
                <button class="edit-btn" @click="editProduct(product)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="deleteProduct(product.ProductID)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo producto -->
      <section v-if="currentView === 'addProduct'" class="product-form">
        <h2>Añadir Nuevo Producto</h2>
        <form @submit.prevent="submitProduct">
          <label for="name">Nombre</label>
          <input
            type="text"
            id="productName"
            v-model="newProduct.Name"
            placeholder="Nombre del producto"
            required
            class="input-field"
          />

          <label for="description">Descripción</label>
          <textarea
            id="productDescription"
            v-model="newProduct.Description"
            placeholder="Descripción del producto"
            class="input-field"
          ></textarea>

          <label for="category">Categoría</label>
          <select
            id="productCategory"
            v-model="newProduct.CategoryID"
            class="input-field"
          >
            <option
              v-for="category in categories"
              :key="category.CategoryID"
              :value="category.CategoryID"
            >
              {{ category.Name }}
            </option>
          </select>

          <label for="price">Precio</label>
          <input
            type="number"
            id="productPrice"
            v-model="newProduct.Price"
            placeholder="Precio del producto"
            required
            class="input-field"
          />

          <label for="stock">Stock</label>
          <input
            type="number"
            id="productStock"
            v-model="newProduct.Stock"
            placeholder="Cantidad en stock"
            class="input-field"
          />

          <label for="unit">Unidad</label>
          <select
            id="productUnit"
            v-model="newProduct.UnitID"
            class="input-field"
          >
            <option
              v-for="unit in units"
              :key="unit.UnitID"
              :value="unit.UnitID"
            >
              {{ unit.Name }}
            </option>
          </select>

          <label for="isAvailable">Disponibilidad</label>
          <select
            id="productIsAvailable"
            v-model="newProduct.IsAvailable"
            class="input-field"
          >
            <option value="1">Disponible</option>
            <option value="0">No Disponible</option>
          </select>

          <button type="submit" class="add-btn">Añadir Producto</button>
        </form>
      </section>

      <!-- Formulario para agregar imágenes del producto -->
      <section
        v-if="currentView === 'addProductImages'"
        class="product-images-form"
      >
        <h2>Agregar Imágenes al Producto</h2>
        <form enctype="multipart/form-data" @submit.prevent="submitImages">
          <label for="images">Seleccionar Imágenes</label>
          <input type="file" multiple @change="handleFileUpload" accept="image/*" required />

          <button type="submit" class="add-btn">Añadir Imágenes</button>
        </form>

        <!-- Visualización de las imágenes subidas -->
        <div v-if="uploadedImages.length">
          <h3>Imágenes Subidas</h3>
          <div class="images-preview">
            <img
              v-for="image in uploadedImages"
              :key="image.publicId"
              :src="image.url"
              alt="Imagen del producto"
            />
          </div>
        </div>
      </section>

      <!-- Formulario para editar producto existente -->
      <section v-if="currentView === 'editProduct'" class="product-form">
        <h2>Editar Producto</h2>
        <form @submit.prevent="updateProductMethod">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="selectedProduct.Name"
            placeholder="Nombre del producto"
            required
          />

          <label for="description">Descripción</label>
          <textarea
            v-model="selectedProduct.Description"
            placeholder="Descripción del producto"
          ></textarea>

          <button type="submit" class="update-btn">Actualizar Producto</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  fetchProducts,
  registerProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import { fetchUnits } from "../../services/unitService.js";
import { fetchCategories } from "../../services/categoryService.js";
import { createImage } from "../../services/imageService";

export default {
  data() {
    return {
      units: [],
      categories: [],
      products: [],
      currentView: "viewProducts",
      newProduct: {
        Name: "",
        Description: "",
        Price: "",
        Stock: 0,
        IsAvailable: 1,
        UnitID: 1,
        CategoryID: 1,
      },
      selectedProduct: null,
      uploadedImages: [],
      productId: null,
    };
  },
  async created() {
    this.products = await fetchProducts();
    console.log("products in manage products: ", this.products);
    this.units = await fetchUnits();
    this.units = this.units.data;
    console.log("units in manage products: ", this.units);
    this.categories = await fetchCategories();
    this.categories = this.categories.data;
    console.log("categories in manage products: ", this.categories);
  },
  methods: {
    goBack(){
      this.$router.push("/admin/home");
    },
    async submitProduct() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear un nuevo producto?",
        icon: "question",
        text: "Se creará el nuevo producto según lo especificado. Luego podrás agregar imágenes y editarlo.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      // Comprobar respuesta
      if (result.isConfirmed) {
        this.newProduct = {
          name: this.newProduct.Name,
          description: this.newProduct.Description,
          price: this.newProduct.Price,
          stock: this.newProduct.Stock,
          isAvailable: this.newProduct.IsAvailable,
          unitID: this.newProduct.UnitID,
          categoryID: this.newProduct.CategoryID,
        };

        const resCreated = await registerProduct(this.newProduct);

        if (resCreated.status) {
          await this.$swal({
            title: "¡El producto ha sido creado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
            html: `<strong>${resCreated.data.msg}</strong>`,
          });
          console.log("resCreated: ", resCreated);
          this.productId = resCreated.data.productID;
          this.currentView = "addProductImages"; // Redirigir a la vista de agregar imágenes
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo crear el producto.",
            icon: "error",
            confirmButtonText: "OK",
            text: resCreated.error.response.request.response,
          });
        }

        this.newProduct = { Name: "", Description: "" };
      }
    },
    async deleteProduct(productId) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar el producto?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      // Comprobar respuesta
      if (result.isConfirmed) {
        const resDeleted = await deleteProduct(productId);

        if (resDeleted.status) {
          await this.$swal({
            title: "¡El producto ha sido eliminado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo eliminar el producto.",
            icon: "error",
            confirmButtonText: "OK",
            text: resDeleted.error.response.request.response,
          });
        }
      }
    },
    editProduct(product) {
      this.selectedProduct = { ...product };
      this.currentView = "editProduct";
    },
    async updateProductMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar el producto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const redUpdated = await updateProduct(
          this.selectedProduct.ProductID,
          this.selectedProduct
        );

        if (redUpdated.status) {
          await this.$swal({
            title: "¡El producto ha sido editado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo editar el producto.",
            icon: "error",
            confirmButtonText: "OK",
            text: redUpdated.error.response.request.response,
          });
        }

        this.products = await fetchProducts();
        this.products = this.products.data;
        this.currentView = "viewProducts";
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0]; // Obtener el archivo de la selección
      this.uploadedImages = []; // Limpiar las imágenes previas
      if (file) {
        this.uploadImageMethod(file); // Llamar al método para subir la imagen
      }
    },

    async uploadImageMethod(file) {
      console.log("file: ", file);
      try {
        const result = await createImage(file, "products", this.productId); // Llamar al servicio para subir la imagen

        if (result.status) {
          this.uploadedImages.push(result.data); // Añadir la imagen subida a la lista de imágenes
        } else {
          throw new Error(result.msg);
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        await this.$swal({
          title: "Error al subir la imagen",
          icon: "error",
          text: error.message,
        });
      }
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

.btns{
  display: flex;
  justify-content: space-around;
}

/* Estilos generales */
.manage-products {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fa;
  font-family: "Arial", sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #018c91;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: white;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sidebar li:hover {
  background-color: #34495e;
}

.content {
  flex-grow: 1;
  padding: 40px 20px;
}

.header {
  background-color: #ecf0f1;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.header h1 {
  font-size: 2em;
  color: #2c3e50;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.product-list,
.product-form,
.product-images-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

h2 {
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #018c91;
  color: white;
}

td {
  background-color: #ecf0f1;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #48bfce;
  color: white;
}

.edit-btn:hover {
  background-color: rgb(60, 174, 189);
}

.delete-btn {
  background-color: #b81908;
  color: white;
}

.delete-btn:hover {
  background-color: rgb(112, 25, 16);
}

.add-btn,
.update-btn {
  background-color: #1c696c;
  color: white;
}

.add-btn:hover,
.update-btn:hover {
  background-color: #1c696c;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
  background-color: #ecf0f1;
  color: #2c3e50;
}

input[type="file"] {
  margin-top: 10px;
}

.images-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.images-preview img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

/* Estilos generales para el formulario */
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

/* Estilo para los labels */
form label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

/* Estilo de los inputs, selects y textareas comunes */
.input-field {
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

#productPrice,
#productStock {
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

#productDescription {
  resize: vertical;
  min-height: 100px;
}

/* Estilos para el select */
input[type="number"]:focus,
select:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

.input-field:focus {
  border-color: #0056b3;
}

/* Estilo del botón de añadir producto */
.add-btn {
  background-color: #018c91;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #1c696c;
}

.add-btn:focus {
  outline: none;
}

/* Estilo para los campos requeridos */
input[required],
textarea[required],
select[required] {
  border: 1px solid #007bff;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #0056b3;
  outline: none;
}

/* Estilo para los campos de unidad (select) */
select {
  background-color: #f9f9f9;
}

/* Estilo de separación entre los campos */
form > label,
form > input,
form > select,
form > textarea {
  margin-bottom: 15px;
}
</style>
