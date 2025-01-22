<template>
  <div class="manage-payment-types">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewPaymentTypes'">Ver Tipos de Pago</li>
        <li @click="currentView = 'addPaymentType'">
          Añadir Nuevo Tipo de Pago
        </li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
        <h1>Gestión de Tipos de Pago</h1>
        <p>Administra y configura los tipos de pago disponibles</p>
      </header>

      <!-- Vista para ver y gestionar tipos de pago -->
      <section
        v-if="currentView === 'viewPaymentTypes'"
        class="payment-type-list"
      >
        <h2>Tipos de Pago Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="type in paymentTypes" :key="type.PaymentTypeID">
              <td>{{ type.PaymentTypeID }}</td>
              <td>{{ type.Name }}</td>
              <td class="btns">
                <button class="edit-btn" @click="editPaymentType(type)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="deletePaymentType(type.PaymentTypeID)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo tipo de pago -->
      <section
        v-if="currentView === 'addPaymentType'"
        class="payment-type-form"
      >
        <h2>Añadir Nuevo Tipo de Pago</h2>
        <form @submit.prevent="submitPaymentType">
          <label for="name">Nombre</label>
          <input
            type="text"
            id="paymentTypeName"
            v-model="newPaymentType.Name"
            placeholder="Nombre del tipo de pago"
            required
            class="input-field"
          />
          <button type="submit" class="add-btn">Añadir Tipo de Pago</button>
        </form>
      </section>

      <!-- Formulario para editar tipo de pago existente -->
      <section
        v-if="currentView === 'editPaymentType'"
        class="payment-type-form"
      >
        <h2>Editar Tipo de Pago</h2>
        <form @submit.prevent="updatePaymentTypeMethod">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="selectedPaymentType.Name"
            placeholder="Nombre del tipo de pago"
            required
          />
          <button type="submit" class="update-btn">
            Actualizar Tipo de Pago
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  getAllPaymentTypes,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
} from "../../services/paymentTypeService";

export default {
  data() {
    return {
      paymentTypes: [],
      currentView: "viewPaymentTypes",
      newPaymentType: {
        Name: "",
      },
      selectedPaymentType: null,
    };
  },
  async created() {
    this.paymentTypes = await getAllPaymentTypes();
    this.paymentTypes = this.paymentTypes.data;
  },
  methods: {
    goBack(){
      this.$router.push("/admin/home");
    },
    async submitPaymentType() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear un nuevo tipo de pago?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resCreated = await createPaymentType(this.newPaymentType);

        if (resCreated.status) {
          await this.$swal({
            title: "¡El tipo de pago ha sido creado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.paymentTypes = await getAllPaymentTypes();
          this.paymentTypes = this.paymentTypes.data;
          this.newPaymentType = { Name: "" };
          this.currentView = "viewPaymentTypes";
        } else {
          await this.$swal({
            title: "Error al crear el tipo de pago",
            icon: "error",
            text: resCreated.msg,
          });
        }
      }
    },
    async deletePaymentType(paymentTypeId) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar el tipo de pago?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resDeleted = await deletePaymentType(paymentTypeId);

        if (resDeleted.status) {
          await this.$swal({
            title: "¡El tipo de pago ha sido eliminado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.paymentTypes = await getAllPaymentTypes();
          this.paymentTypes = this.paymentTypes.data;
        } else {
          await this.$swal({
            title: "Error al eliminar el tipo de pago",
            icon: "error",
            text: resDeleted.msg,
          });
        }
      }
    },
    editPaymentType(type) {
      this.selectedPaymentType = { ...type };
      this.currentView = "editPaymentType";
    },
    async updatePaymentTypeMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar el tipo de pago?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resUpdated = await updatePaymentType(
          this.selectedPaymentType.PaymentTypeID,
          this.selectedPaymentType
        );

        if (resUpdated.status) {
          await this.$swal({
            title: "¡El tipo de pago ha sido editado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.paymentTypes = await getAllPaymentTypes();
          this.paymentTypes = this.paymentTypes.data;
          console.log("this.paymentTypes: ", this.paymentTypes);
          this.currentView = "viewPaymentTypes";
        } else {
          await this.$swal({
            title: "Error al editar el tipo de pago",
            icon: "error",
            text: resUpdated.msg,
          });
        }
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

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btns{
  display: flex;
  justify-content: space-around;
}

/* Estilos generales */
.manage-payment-types {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fa;
  font-family: "Arial", sans-serif;
}

.sidebar {
  width: 200px;
  background-color: #018c91;
  color: #fff;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #fff;
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

.state-list,
.state-form {
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
  background-color: #018c91;
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

/* Estilos específicos del formulario */
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

.input-field:focus {
  border-color: #0056b3;
  outline: none;
}

.add-btn {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #0056b3;
}
</style>
