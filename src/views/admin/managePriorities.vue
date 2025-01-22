<template>
  <div class="manage-priorities">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewpriorities'">Ver Niveles de Prioridad</li>
        <li @click="currentView = 'addPriority'">
          Añadir Nuevo Nivel de Prioridad
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
        <h1>Gestión de Niveles de Prioridad</h1>
        <p>Administra y configura los Niveles de Prioridad disponibles</p>
      </header>

      <!-- Vista para ver y gestionar tipos de pago -->
      <section
        v-if="currentView === 'viewpriorities'"
        class="priority-list"
      >
        <h2>Tipos de niveles Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="priority in priorities" :key="priority.PriorityID">
              <td>{{ priority.PriorityID }}</td>
              <td>{{ priority.Name }}</td>
              <td class="btns">
                <button class="edit-btn" @click="editPriority(priority)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="deletePriority(priority.PriorityID)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo Niveles de Prioridad -->
      <section
        v-if="currentView === 'addPriority'"
        class="priority-form"
      >
        <h2>Añadir Nuevo Nivel de Prioridad</h2>
        <form @submit.prevent="submitPriority">
          <label for="name">Nombre</label>
          <input
            priority="text"
            id="priorityName"
            v-model="newPriority.Name"
            placeholder="Nombre Nivel de Prioridad"
            required
            class="input-field"
          />
          <button priority="submit" class="add-btn">Añadir Nivel de Prioridad</button>
        </form>
      </section>

      <!-- Formulario para editar Nivel de Prioridad existente -->
      <section
        v-if="currentView === 'editPriority'"
        class="priority-form"
      >
        <h2>Editar Nivel de Prioridad</h2>
        <form @submit.prevent="updatePriorityMethod">
          <label for="name">Nombre</label>
          <input
            priority="text"
            v-model="selectedPriority.Name"
            placeholder="Nombre del Nivel de Prioridad"
            required
          />
          <button priority="submit" class="update-btn">
            Actualizar Nivel de Prioridad
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  fetchPriorities,
  createPriority,
  updatePriority,
  deletePriority,
} from "../../services/priorityService";

export default {
  data() {
    return {
      priorities: [],
      currentView: "viewpriorities",
      newPriority: {
        Name: "",
      },
      selectedPriority: null,
    };
  },
  async created() {
    this.priorities = await fetchPriorities();
    this.priorities = this.priorities.data;
  },
  methods: {
    goBack(){
      this.$router.push("/admin/home");
    },
    async submitPriority() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear un nuevo tipo de pago?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resCreated = await createPriority(this.newPriority);

        if (resCreated.status) {
          await this.$swal({
            title: "¡El tipo de pago ha sido creado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.priorities = await fetchPriorities();
          this.priorities = this.priorities.data;
          this.newPriority = { Name: "" };
          this.currentView = "viewpriorities";
        } else {
          await this.$swal({
            title: "Error al crear el tipo de pago",
            icon: "error",
            text: resCreated.msg,
          });
        }
      }
    },
    async deletePriority(PriorityID) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar el tipo de pago?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resDeleted = await deletePriority(PriorityID);

        if (resDeleted.status) {
          await this.$swal({
            title: "¡El tipo de pago ha sido eliminado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.priorities = await fetchPriorities();
          this.priorities = this.priorities.data;
        } else {
          await this.$swal({
            title: "Error al eliminar el tipo de pago",
            icon: "error",
            text: resDeleted.msg,
          });
        }
      }
    },
    editPriority(priority) {
      this.selectedPriority = { ...priority };
      this.currentView = "editPriority";
    },
    async updatePriorityMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar el tipo de pago?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const resUpdated = await updatePriority(
          this.selectedPriority.PriorityID,
          this.selectedPriority
        );

        if (resUpdated.status) {
          await this.$swal({
            title: "¡El tipo de pago ha sido editado satisfactoriamente!",
            icon: "success",
            confirmButtonText: "OK",
          });
          this.priorities = await fetchPriorities();
          this.priorities = this.priorities.data;
          console.log("this.priorities: ", this.priorities);
          this.currentView = "viewpriorities";
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

.btns{
  display: flex;
  justify-content: space-around;
}
/* Estilos generales */
.manage-priorities {
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

input[priority="text"],
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
