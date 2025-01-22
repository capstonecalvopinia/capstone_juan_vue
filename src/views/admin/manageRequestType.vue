<template>
  <div class="manage-request-types">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewRequestTypes'">
          Ver Tipos de Solicitud
        </li>
        <li @click="currentView = 'addRequestType'">
          Añadir Nuevo Tipo de Solicitud
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
        <h1>Gestión de Tipos de Solicitud</h1>
        <p>Administra y configura los Tipos de Solicitud disponibles</p>
      </header>

      <!-- Vista para ver y gestionar tipos de solicitud -->
      <section
        v-if="currentView === 'viewRequestTypes'"
        class="request-type-list"
      >
        <h2>Tipos de Solicitud Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="requestType in requestTypes"
              :key="requestType.RequestTypeID"
            >
              <td>{{ requestType.RequestTypeID }}</td>
              <td>{{ requestType.Name }}</td>
              <td>{{ requestType.Description }}</td>
              <td class="btns">
                <button class="edit-btn" @click="editRequestType(requestType)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="deleteRequestTypeMethod(requestType.RequestTypeID)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo Tipo de Solicitud -->
      <section
        v-if="currentView === 'addRequestType'"
        class="request-type-form"
      >
        <h2>Añadir Nuevo Tipo de Solicitud</h2>
        <form @submit.prevent="submitRequestType">
          <label for="name">Nombre</label>
          <input
            type="text"
            id="requestTypeName"
            v-model="newRequestType.Name"
            placeholder="Nombre del Tipo de Solicitud"
            required
            class="input-field"
          />
          <label for="description">Descripción</label>
          <textarea
            id="requestTypeDescription"
            v-model="newRequestType.Description"
            placeholder="Descripción del Tipo de Solicitud"
            class="input-field"
          ></textarea>
          <button type="submit" class="add-btn">
            Añadir Tipo de Solicitud
          </button>
        </form>
      </section>

      <!-- Formulario para editar Tipo de Solicitud existente -->
      <section
        v-if="currentView === 'editRequestType'"
        class="request-type-form"
      >
        <h2>Editar Tipo de Solicitud</h2>
        <form @submit.prevent="updateRequestTypeMethod">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="selectedRequestType.Name"
            placeholder="Nombre del Tipo de Solicitud"
            required
          />
          <label for="description">Descripción</label>
          <textarea
            v-model="selectedRequestType.Description"
            placeholder="Descripción del Tipo de Solicitud"
            class="input-field"
          ></textarea>
          <button type="submit" class="update-btn">
            Actualizar Tipo de Solicitud
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  getAllRequestTypes,
  createRequestType,
  updateRequestType,
  deleteRequestType,
} from "../../services/requestTypeService";

export default {
  data() {
    return {
      requestTypes: [],
      currentView: "viewRequestTypes",
      newRequestType: {
        Name: "",
        Description: "",
      },
      selectedRequestType: null,
    };
  },
  async created() {
    this.requestTypes = await getAllRequestTypes();
    this.requestTypes = this.requestTypes.data;
    console.log("this.requestTypes: ", this.requestTypes);
  },
  methods: {
    goBack() {
      this.$router.push("/admin/home");
    },
    async submitRequestType() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear un nuevo tipo de solicitud?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resCreated = await createRequestType(this.newRequestType);

        if (resCreated.status) {
          await this.$swal({
            title: "¡El tipo de solicitud ha sido creado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.requestTypes = await getAllRequestTypes();
          this.requestTypes = this.requestTypes.data;
          this.newRequestType = { Name: "", Description: "" };
          this.currentView = "viewRequestTypes";
        } else {
          await this.$swal({
            title: "Error al crear el tipo de solicitud",
            icon: "error",
            text: resCreated.msg,
          });
        }
      }
    },
    async deleteRequestTypeMethod(RequestTypeID) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar el tipo de solicitud?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        console.log("RequestTypeID: ", RequestTypeID);
        const resDeleted = await deleteRequestType(RequestTypeID);

        if (resDeleted.status) {
          await this.$swal({
            title:
              "¡El tipo de solicitud ha sido eliminado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.requestTypes = await getAllRequestTypes();
          this.requestTypes = this.requestTypes.data;
        } else {
          await this.$swal({
            title: "Error al eliminar el tipo de solicitud",
            icon: "error",
            text: resDeleted.msg,
          });
        }
      }
    },
    editRequestType(requestType) {
      this.selectedRequestType = { ...requestType };
      this.currentView = "editRequestType";
    },
    async updateRequestTypeMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar el tipo de solicitud?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resUpdated = await updateRequestType(
          this.selectedRequestType.RequestTypeID,
          this.selectedRequestType
        );

        if (resUpdated.status) {
          await this.$swal({
            title: "¡El tipo de solicitud ha sido editado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.requestTypes = await getAllRequestTypes();
          this.requestTypes = this.requestTypes.data;
          this.currentView = "viewRequestTypes";
        } else {
          await this.$swal({
            title: "Error al editar el tipo de solicitud",
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

.btns {
  display: flex;
  justify-content: space-around;
}
/* Estilos generales */
.manage-request-types {
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

.type-list,
.type-form {
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
