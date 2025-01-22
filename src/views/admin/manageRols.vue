<template>
  <div class="manage-roles">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewRoles'">Ver Roles</li>
        <li @click="currentView = 'addRole'">Añadir Nuevo Rol</li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>

        <h1>Gestión de Roles</h1>
        <p>Administra y configura los roles de usuario de la aplicación</p>
      </header>

      <!-- Vista para ver y gestionar roles -->
      <section v-if="currentView === 'viewRoles'" class="role-list">
        <h2>Roles Existentes</h2>
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
            <tr v-for="role in roles" :key="role.RolID">
              <td>{{ role.RolID }}</td>
              <td>{{ role.Name }}</td>
              <td>{{ role.Description }}</td>
              <td class="btns">
                <button class="edit-btn" @click="editRole(role)">Editar</button>
                <!-- <button class="delete-btn" @click="deleteRole(role.RolID)">
                  Eliminar
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo rol -->
      <section v-if="currentView === 'addRole'" class="role-form">
        <h2>Añadir Nuevo Rol</h2>
        <form @submit.prevent="submitRole">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="newRole.Name"
            placeholder="Nombre del rol"
            required
          />

          <label for="description">Descripción</label>
          <textarea
            v-model="newRole.Description"
            placeholder="Descripción del rol"
          ></textarea>

          <button type="submit" class="add-btn">Añadir Rol</button>
        </form>
      </section>

      <!-- Formulario para editar rol existente -->
      <section v-if="currentView === 'editRole'" class="role-form">
        <h2>Editar Rol</h2>
        <form @submit.prevent="updateRoleMethod">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="selectedRole.Name"
            placeholder="Nombre del rol"
            required
          />

          <label for="description">Descripción</label>
          <textarea
            v-model="selectedRole.Description"
            placeholder="Descripción del rol"
          ></textarea>

          <button type="submit" class="update-btn">Actualizar Rol</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../services/rolService";

export default {
  data() {
    return {
      roles: [],
      currentView: "viewRoles",
      newRole: { name: "", Description: "" },
      selectedRole: null,
    };
  },
  async created() {
    this.roles = await fetchRoles();
    this.roles = this.roles.data;
  },
  methods: {
    goBack(){
      this.$router.push("/admin/home");
    },
    async submitRole() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear un nuevo rol?",
        icon: "question",
        text: "Se creará el nuevo rol según lo especificado. Luego podrás modificarlo o eliminarlo según tus necesidades.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        const resCreated = await createRole(this.newRole);

        if (resCreated.status) {
          await this.$swal({
            title: "¡El rol ha sido creado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
            html: `<p style="color: gray; font-size: 14px;">Resultado</p> <strong>${resCreated.data.msg}</strong>`,
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo crear el rol.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: resCreated.error.response.request.response,
          });
        }

        this.newRole = { Name: "", Description: "" };
        this.roles = await fetchRoles();
        this.roles = this.roles.data;
        this.currentView = "viewRoles";
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
      }
    },
    async deleteRole(roleId) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar el rol?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        const resDeleted = await deleteRole(roleId);
        this.roles = await fetchRoles();
        this.roles = this.roles.data;

        if (resDeleted.status) {
          await this.$swal({
            title: "¡El rol ha sido eliminado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo eliminar el rol.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: resDeleted.error.response.request.response,
          });
        }
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
      }
    },
    editRole(role) {
      this.selectedRole = { ...role };
      console.log("this.selectedRole: ", this.selectedRole);
      this.currentView = "editRole";
    },
    async updateRoleMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar el rol?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        const redUpdated = await updateRole(
          this.selectedRole.RolID,
          this.selectedRole
        );

        if (redUpdated.status) {
          await this.$swal({
            title: "¡El rol ha sido editado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo editar el rol.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: redUpdated.error.response.request.response,
          });
        }

        this.roles = await fetchRoles();
        this.roles = this.roles.data;
        this.currentView = "viewRoles";
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

.btns {
  display: flex;
  justify-content: space-around;
}

.manage-roles {
  display: flex;
  font-family: Arial, sans-serif;
  color: #333;
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
  width: 80%;
  padding: 2rem;
}

.header h1 {
  font-size: 1.8rem;
}

.header p {
  color: #555;
  margin-top: 0.5rem;
}

.role-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.role-list th,
.role-list td {
  padding: 0.75rem;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  background-color: #018c91;
  color: white;
}

.edit-btn,
.delete-btn,
.add-btn,
.update-btn {
  /* background: #4caf50; */
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.add-btn {
  background-color: #018c91;
  margin-top: 1rem;
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

.role-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.role-form label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

.role-form input,
.role-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.25rem;
}

.role-form textarea {
  resize: vertical;
  min-height: 100px;
}
</style>
