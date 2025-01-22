<template>
  <div class="manage-units">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewUnidades'">Ver Unidades</li>
        <li @click="currentView = 'addunit'">Añadir Unidades</li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
        <h1>Gestión de Unidades</h1>
        <p>Administra y configura las unidades (de peso) de la aplicación</p>
      </header>

      <!-- Vista para ver y gestionar unidads -->
      <section v-if="currentView === 'viewUnidades'" class="unidad-list">
        <h2>Unidades Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Abreviatura</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unit in units" :key="unit.RolID">
              <td>{{ unit.UnitID }}</td>
              <td>{{ unit.Name }}</td>
              <td>{{ unit.ShortName }}</td>
              <td class="btns">
                <button class="edit-btn" @click="editUnit(unit)">Editar</button>
                <button class="delete-btn" @click="deleteUnitMethod(unit.UnitID)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nueva unidad -->
      <section v-if="currentView === 'addunit'" class="unit-form">
        <h2>Añadir nueva unidad</h2>
        <form @submit.prevent="submitunit">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="newunit.Name"
            placeholder="Nombre del unidad"
            required
          />

          <label for="ShortName">Abreviatura</label>
          <input
            type="text"
            v-model="newunit.ShortName"
            placeholder="Abreviatura de la unidad"
            required
          />

          <button type="submit" class="add-btn">Añadir unidad</button>
        </form>
      </section>

      <!-- Formulario para editar unidad existente -->
      <section v-if="currentView === 'editUnit'" class="unit-form">
        <h2>Editar unidad</h2>
        <form @submit.prevent="updateUnitMethod">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="selectedunit.Name"
            placeholder="Nombre del unidad"
            required
          />

          <label for="ShortName">Abreviatura</label>
          <input
            type="text"
            v-model="selectedunit.ShortName"
            placeholder="Abreviatura de la unidad"
          />

          <button type="submit" class="update-btn">Actualizar unidad</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  fetchUnits,
  registerUnit,
  updateUnit,
  deleteUnit,
} from "../../services/unitService";

export default {
  data() {
    return {
      units: [],
      currentView: "viewUnidades",
      newunit: { Name: "", ShortName: ""},
      selectedunit: null,
    };
  },
  async created() {
    this.units = await fetchUnits();
    console.log("this.units: ", this.units);
    this.units = this.units.data;
    
  },
  methods: {
    goBack(){
      this.$router.push("/admin/home");
    },
    async submitunit() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear una nueva unidad?",
        icon: "question",
        text: "Se creará la nueva unidad según lo especificado. Luego podrás modificarlo o eliminarlo según tus necesidades.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        console.log("this.newunit in create: ", this.newunit);
        // this.newunit = {
        //   name: this.newunit.Name,
        //   address: this.newunit.ShortName,
        // };
        const resCreated = await registerUnit(this.newunit);
        console.log("resCreated en creación de unidad: ", resCreated);
        if (resCreated.status) {
          await this.$swal({
            title: "¡La unidad ha sido creado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
            html: `<p style="color: gray; font-size: 14px;">Resultado</p> <strong>${resCreated.data.msg}</strong>`,
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo crear la unidad.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: resCreated.error.response.request.response,
          });
        }
        this.newunit = { Name: "", ShortName: ""};
        this.units = await fetchUnits();
        this.units = this.units.data;
        this.currentView = "viewUnidades";
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
      }
    },
    async deleteUnitMethod(unitId) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar la unidad?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) { 
        console.log("unitId a eliminar: ", unitId);
        const resDeleted = await deleteUnit(unitId);
        console.log("resDeleted: ", resDeleted);
        if (resDeleted.status) {
          await this.$swal({
            title: "Lal unidad ha sido eliminado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo eliminar la unidad.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: resDeleted.error.response.request.response,
          });
        }

        this.units = await fetchUnits();
        this.units = this.units.data;
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
      }
    },
    editUnit(unit) {
      console.log("unit in editUnit: ", unit);
      this.selectedunit = { ...unit };
      this.currentView = "editUnit";
    },
    async updateUnitMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar la unidad?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        console.log("updateUnitMethod");
        console.log("this.selectedunit.unitID: ", this.selectedunit.unitID);
        console.log("this.selectedunit: ", this.selectedunit);
        const redUpdated = await updateUnit(
          this.selectedunit.unitID,
          this.selectedunit
        );
        if (redUpdated.status) {
          await this.$swal({
            title: "¡La unidad ha sido editado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo editar la unidad.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: redUpdated.error.response.request.response,
          });
        }

        this.units = await fetchUnits();
        this.units = this.units.data;
        this.currentView = "viewUnidades";
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
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

.manage-units {
  display: flex;
}

.sidebar {
  width: 200px;
  background-color: #018c91;
  color: #fff;
  padding: 20px;
}

.sidebar h2 {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.content {
  flex-grow: 1;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 1.8rem;
  color: #333;
}

.unidad-list table {
  width: 100%;
  border-collapse: collapse;
}

.unidad-list th,
.unidad-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #018c91;
  color: white;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
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
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.unit-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.unit-form h2 {
  text-align: center;
  color: #333;
}

.unit-form label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.unit-form input,
.unit-form select,
.unit-form textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-btn,
.update-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #018c91;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.add-btn {
  background-color: #018c91;
}

.update-btn {
  background-color: #1c696c;
}
</style>
