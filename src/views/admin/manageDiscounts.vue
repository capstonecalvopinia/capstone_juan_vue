<template>
  <div class="manage-discounts">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewDiscounts'">Ver Descuentos</li>
        <li @click="currentView = 'addDiscount'">Añadir Nuevo Descuento</li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
        <h1>Gestión de Descuentos</h1>
        <p>Administra y configura los descuentos de productos</p>
      </header>

      <!-- Vista para ver y gestionar descuentos -->
      <section v-if="currentView === 'viewDiscounts'" class="discount-list">
        <h2>Descuentos Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Descuento (%)</th>
              <th>Fecha de Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="discount in discounts" :key="discount.DiscountID">
              <td>{{ discount.productName }}</td>
              <td>{{ discount.DiscountPercentage }}%</td>
              <td>{{ discount.EndDate }}</td>
              <td class="btns">
                <button class="edit-btn" @click="editDiscount(discount)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="deleteDiscount(discount.DiscountID)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo descuento -->
      <section v-if="currentView === 'addDiscount'" class="discount-form">
        <h2>Añadir Nuevo Descuento</h2>
        <form @submit.prevent="submitDiscount">
          <label for="productSelect" class="select-label"
            >Selecciona un producto:</label
          >
          <select
            id="productSelect"
            v-model="selectedProductId"
            class="select-input"
          >
            <option value="" disabled selected>Elige un producto</option>
            <option
              v-for="product in products"
              :key="product.ProductID"
              :value="product.ProductID"
            >
              {{ product.Name }}
            </option>
          </select>

          <label for="discountPercentage">Porcentaje de Descuento</label>
          <input
            type="number"
            v-model="newDiscount.DiscountPercentage"
            placeholder="Porcentaje de descuento"
            id="discountPercentage"
            required
            min="0"
            max="100"
          />

          <label for="expirationDate">Fecha de Comienzo</label>
          <input
            type="date"
            v-model="newDiscount.StartDate"
            id="startDate"
            required
          />

          <label for="expirationDate">Fecha de Vencimiento</label>
          <input
            type="date"
            v-model="newDiscount.EndDate"
            id="expirationDate"
            required
          />

          <button type="submit" class="add-btn">Añadir Descuento</button>
        </form>
      </section>

      <!-- Formulario para editar descuento existente -->
      <section v-if="currentView === 'editDiscount'" class="discount-form">
        <h2>Editar Descuento</h2>
        <form @submit.prevent="updateDiscountMethod">
          <label for="productName">Producto</label>
          <input
            type="text"
            id="productName"
            v-model="selectedDiscount.ProductName"
            placeholder="Nombre del producto"
            required
          />

          <label for="discountPercentage">Porcentaje de Descuento</label>
          <input
            type="number"
            id="discountPercentage"
            v-model="selectedDiscount.DiscountPercentage"
            placeholder="Porcentaje de descuento"
            required
            min="0"
            max="100"
          />

          <label for="expirationDate">Fecha de Vencimiento</label>
          <input
            type="date"
            id="expirationDate"
            v-model="selectedDiscount.EndDate"
            required
          />

          <button type="submit" class="update-btn">Actualizar Descuento</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  fetchDiscounts,
  registerDiscount,
  updateDiscount,
  deleteDiscount,
} from "../../services/discountService";

import { fetchProducts } from "../../services/productService.js";
export default {
  data() {
    return {
      discounts: [],
      products: [],
      newDiscount: {
        ProductID: "",
        DiscountPercentage: "",
        EndDate: "",
        StartDate: "",
      },
      selectedDiscount: null,
      currentView: "viewDiscounts",
      selectedProductId: null,
    };
  },
  async created() {
    this.discounts = await fetchDiscounts();
    //this.discounts = this.discounts.data;
    this.products = await fetchProducts();

    this.discounts.forEach((discount) => {
      // Encontrar el producto correspondiente usando el ProductID
      const product = this.products.find(
        (product) => product.ProductID === discount.ProductID
      );

      discount.productName = product ? product.Name : "N/A";

      // if (product) {

      //   // Imprimir o usar el nombre del producto
      //   console.log(
      //     `Producto: ${product.Name}, Descuento: ${discount.DiscountPercentage}%`
      //   );
      // } else {
      //   console.log(`Producto con ID ${discount.ProductID} no encontrado.`);
      // }
    });

    console.log("this.discounts: ", this.discounts);

    //this.products = this.products.data;
  },
  methods: {
    goBack() {
      this.$router.push("/admin/home");
    },
    getCurrentDateForSQL() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Mes en formato 2 dígitos
      const day = String(now.getDate()).padStart(2, "0"); // Día en formato 2 dígitos
      const hours = String(now.getHours()).padStart(2, "0"); // Hora en formato 2 dígitos
      const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutos en formato 2 dígitos
      const seconds = String(now.getSeconds()).padStart(2, "0"); // Segundos en formato 2 dígitos

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    async submitDiscount() {
      console.log("selectedProductId: ", this.selectedProductId);
      console.log("this.newDiscount: ");
      this.newDiscount.ProductID = this.selectedProductId;
      //this.newDiscount.StartDate = this.getCurrentDateForSQL();
      registerDiscount(this.newDiscount).then(async (response) => {
        console.log("response registerDiscount: ", response);
        if (response.status) {
          await this.$swal({
            title: "¡El descuento ha sido creado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo crear el descuento.",
            icon: "error",
            confirmButtonText: "OK",
            text: response.error.response.request.response,
          });
        }
        // this.discounts.push(response.data);
        // this.newDiscount = {
        //   ProductID: "",
        //   DiscountPercentage: "",
        //   EndDate: "",
        //   StartDate: "",
        // };
      });
    },
    editDiscount(discount) {
      this.selectedDiscount = { ...discount };
      this.currentView = "editDiscount";
    },
    updateDiscountMethod() {
      updateDiscount(this.selectedDiscount).then((response) => {
        if (response.status) {
          const index = this.discounts.findIndex(
            (d) => d.DiscountID === this.selectedDiscount.DiscountID
          );
          if (index !== -1) {
            this.discounts[index] = response.data;
          }
          this.selectedDiscount = null;
          this.currentView = "viewDiscounts";
        }
      });
    },
    deleteDiscount(discountID) {
      deleteDiscount(discountID).then((response) => {
        if (response.status) {
          this.discounts = this.discounts.filter(
            (d) => d.DiscountID !== discountID
          );
        }
      });
    },
  },
};
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.select-label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.select-input {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

.select-input:focus {
  border-color: #007bff;
  outline: none;
}

.select-input option {
  padding: 10px;
}

.select-input:disabled {
  background-color: #f0f0f0;
  color: #999;
}

.icon-button {
  all: unset;
  cursor: pointer; /* Opcional, para mantener el comportamiento de clic */
}

.icon {
  width: 50px;
  height: 50px;
  color: #018c91;
}

.btns {
  display: flex;
  justify-content: space-around;
}

/* Estilos generales */
.manage-discounts {
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

.discount-list,
.discount-form {
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
input[type="number"],
input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
  background-color: #ecf0f1;
  color: #2c3e50;
}

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

form label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.input-field {
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}
</style>
