<template>
  <div class="manage-users">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewUsers'">Ver Usuarios</li>
        <li @click="currentView = 'addUser'">Añadir Nuevo Usuario</li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
        <h1>Gestión de Usuarios</h1>
        <p>Administra y configura los usuarios de la aplicación</p>
      </header>

      <!-- Vista para ver y gestionar usuarios -->
      <section v-if="currentView === 'viewUsers'" class="user-list">
        <h2>Usuarios Existentes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.UserID">
              <td>{{ user.UserID }}</td>
              <td>{{ user.Name }}</td>
              <td>{{ user.Email }}</td>
              <td>{{ getRolById(user.RolID)}}</td>
              <td class="btns">
                <button class="edit-btn" @click="editUser(user)">Editar</button>
                <button class="delete-btn" @click="deleteUser(user.UserID)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nuevo usuario -->
      <section v-if="currentView === 'addUser'" class="user-form">
        <h2>Añadir Nuevo Usuario</h2>
        <form @submit.prevent="submitUser">
          <label for="name">Nombre</label>
          <input
            type="text"
            v-model="newUser.Name"
            placeholder="Nombre del usuario"
            id="name"
            @blur="validateFieldCreate('name')"
            required
          />
          <p v-if="errors.name" class="error-text">{{ errors.name }}</p>

          <label for="email">Email</label>
          <input
            type="email"
            v-model="newUser.Email"
            placeholder="Correo electrónico"
            @blur="validateFieldCreate('email')"
            id="email"
            required
          />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>

          <label for="bornDate">Fecha de Nacimiento</label>
          <input
            type="date"
            v-model="newUser.BornDate"
            id="bornDate"
            @blur="validateFieldCreate('bornDate')"
            required
          />
          <p v-if="errors.bornDate" class="error-text">{{ errors.bornDate }}</p>

          <label for="password">Contraseña</label>
          <div class="password-container">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="newUser.Password"
              placeholder="Contraseña"
              @blur="validateFieldCreate('password')"
              id="password"
              required
            />
            <span @click="togglePassword" class="toggle-password-icon">👁️</span>
          </div>
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>

          <label for="confirmPassword">Confirmar Contraseña</label>
          <div class="password-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirmar contraseña"
              id="confirmPassword"
              @blur="validateFieldCreate('confirmPassword')"
              required
            />
            <span @click="toggleConfirmPassword" class="toggle-password-icon"
              >👁️</span
            >
          </div>
          <p v-if="errors.confirmPassword" class="error-text">
            {{ errors.confirmPassword }}
          </p>

          <label for="address">Dirección</label>
          <input
            type="text"
            v-model="newUser.Address"
            placeholder="Dirección del usuario"
            id="address"
            @blur="validateFieldCreate('address')"
            required
          />
          <p v-if="errors.address" class="error-text">{{ errors.address }}</p>

          <label for="cellphone">Celular</label>
          <input
            type="tel"
            v-model="newUser.Cellphone"
            placeholder="Número de celular"
            id="phone"
            @blur="validateFieldCreate('phone')"
            required
          />
          <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>

          <label for="personIdentification">Identificación</label>
          <input
            type="text"
            v-model="newUser.PersonIdentification"
            placeholder="Número de identificación"
            @blur="validateFieldCreate('personIdentification')"
            id="personID"
            required
          />
          <p v-if="errors.personIdentification" class="error-text">
            {{ errors.personIdentification }}
          </p>

          <label for="role">Rol</label>
          <select v-model="newUser.RolID" required>
            <option disabled value="">Seleccione un rol</option>
            <option v-for="role in roles" :key="role.RolID" :value="role.RolID">
              {{ role.Name }}
            </option>
          </select>

          <button type="submit" class="add-btn">Añadir Usuario</button>
        </form>
      </section>

      <!-- Formulario para editar usuario existente -->
      <section v-if="currentView === 'editUser'" class="user-form">
        <h2>Editar Usuario</h2>
        <form @submit.prevent="updateUserMethod">
          <label for="name">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="selectedUser.Name"
            placeholder="Nombre del usuario"
            @blur="validateFieldUpdate('name')"
            required
          />
          <p v-if="errors.name" class="error-text">{{ errors.name }}</p>

          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="selectedUser.Email"
            placeholder="Correo electrónico"
            @blur="validateFieldUpdate('email')"
            required
          />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>

          <label for="bornDate">Fecha de Nacimiento</label>
          <input
            type="date"
            id="bornDate"
            v-model="selectedUser.BornDate"
            @blur="validateFieldUpdate('bornDate')"
            required
          />
          <p v-if="errors.bornDate" class="error-text">{{ errors.bornDate }}</p>
          <label for="address">Dirección</label>
          <input
            type="text"
            id="address"
            v-model="selectedUser.Address"
            placeholder="Dirección del usuario"
            @blur="validateFieldUpdate('address')"
          />
          <p v-if="errors.address" class="error-text">{{ errors.address }}</p>

          <label for="cellphone">Celular</label>
          <input
            type="tel"
            id="phone"
            @blur="validateFieldUpdate('phone')"
            v-model="selectedUser.Cellphone"
            placeholder="Número de celular"
          />
          <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>

          <label for="personIdentification">Identificación</label>
          <input
            type="text"
            id="personID"
            v-model="selectedUser.PersonIdentification"
            placeholder="Número de identificación"
            @blur="validateFieldUpdate('personIdentification')"
          />
          <p v-if="errors.personIdentification" class="error-text">
            {{ errors.personIdentification }}
          </p>

          <label for="role">Rol</label>
          <select v-model="selectedUser.RolID" required>
            <option disabled value="">Seleccione un rol</option>
            <option v-for="role in roles" :key="role.RolID" :value="role.RolID">
              {{ role.Name }}
            </option>
          </select>

          <button type="submit" class="update-btn">Actualizar Usuario</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  fetchUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { fetchRoles } from "../../services/rolService";

export default {
  data() {
    return {
      users: [],
      roles: [],
      currentView: "viewUsers",
      newUser: { Name: "", Email: "", RolID: "" },
      selectedUser: null,
      errors: {},
      errorsUpdate: {},
    };
  },
  async created() {
    this.users = await fetchUsers();
    this.users = this.users.data;
    this.roles = await fetchRoles();
    this.roles = this.roles.data;
  },
  methods: {
    getRolById(id){
      let rolName = "";
      this.roles.forEach((rol) =>{
        console.log("rol: ", rol);
        if(rol.RolID == id){
          rolName = rol.Name;
        }
      });   
      return rolName; 
    },
    validateFieldCreate(field) {
      // Valida un campo individual
      switch (field) {
        case "name":
          this.errors.name = this.newUser.Name
            ? ""
            : "Es necesario ingresar el nombre.";
          break;
        case "email":
          if (!this.newUser.Email) {
            this.errors.email = "Es necesario ingresar el correo.";
          } else if (!/\S+@\S+\.\S+/.test(this.newUser.Email)) {
            this.errors.email = "Formato de correo inválido.";
          } else {
            this.errors.email = "";
          }
          break;
        case "bornDate":
          if (!this.newUser.BornDate) {
            this.errors.bornDate =
              "Es necesario ingresar la fecha de nacimiento.";
          } else if (new Date(this.newUser.BornDate) >= new Date()) {
            this.errors.bornDate =
              "La fecha de nacimiento debe ser en el pasado.";
          } else {
            this.errors.bornDate = "";
          }
          break;
        case "password":
          this.errors.password = this.newUser.Password
            ? ""
            : "Es necesario ingresar la contraseña.";
          break;
        case "confirmPassword":
          if (!this.confirmPassword) {
            this.errors.confirmPassword = "Por favor, confirme la contraseña.";
          } else if (this.newUser.Password !== this.confirmPassword) {
            this.errors.confirmPassword = "Las contraseñas no coinciden.";
          } else {
            this.errors.confirmPassword = "";
          }
          break;
        case "address":
          this.errors.address = this.newUser.Address
            ? ""
            : "Es necesario ingresar la dirección.";
          break;
        case "phone":
          if (!this.newUser.Cellphone) {
            this.errors.phone = "Es necesario ingresar el número celular.";
          } else if (!/^\d{10}$/.test(this.newUser.Cellphone)) {
            this.errors.phone = "El número de celular debe tener 10 dígitos.";
          } else {
            this.errors.phone = "";
          }
          break;
        case "personIdentification":
          if (!this.newUser.PersonIdentification) {
            this.errors.personIdentification =
              "Es necesario ingresar la cédula de identidad.";
          } else if (!this.validateEcuadorianID(this.newUser.PersonIdentification)) {
            this.errors.personIdentification = "Cédula inválida.";
          } else {
            this.errors.personIdentification = "";
          }
          break;
      }
    },
    validateEcuadorianID(id) {
      if (!/^\d{10}$/.test(id)) return false;
      const provinceCode = parseInt(id.slice(0, 2));
      const thirdDigit = parseInt(id.charAt(2));
      if (provinceCode < 1 || provinceCode > 24 || thirdDigit > 5) return false;
      const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        let product = parseInt(id[i]) * coefficients[i];
        if (product >= 10) product -= 9;
        sum += product;
      }
      const verifier = 10 - (sum % 10 === 0 ? 10 : sum % 10);
      return verifier === parseInt(id[9]);
    },
    validateFieldUpdate(field) {
      // Valida un campo individual
      switch (field) {
        case "name":
          this.errors.name = this.selectedUser.Name
            ? ""
            : "Es necesario ingresar el nombre.";
          break;
        case "email":
          if (!this.selectedUser.Email) {
            this.errors.email = "Es necesario ingresar el correo.";
          } else if (!/\S+@\S+\.\S+/.test(this.selectedUser.Email)) {
            this.errors.email = "Formato de correo inválido.";
          } else {
            this.errors.email = "";
          }
          break;
        case "bornDate":
          if (!this.selectedUser.BornDate) {
            this.errors.bornDate =
              "Es necesario ingresar la fecha de nacimiento.";
          } else if (new Date(this.selectedUser.BornDate) >= new Date()) {
            this.errors.bornDate =
              "La fecha de nacimiento debe ser en el pasado.";
          } else {
            this.errors.bornDate = "";
          }
          break;
        case "address":
          this.errors.address = this.selectedUser.Address
            ? ""
            : "Es necesario ingresar la dirección.";
          break;
        case "phone":
          if (!this.selectedUser.Phone) {
            this.errors.phone = "Es necesario ingresar el número celular.";
          } else if (!/^\d{10}$/.test(this.selectedUser.Phone)) {
            this.errors.phone = "El número de celular debe tener 10 dígitos.";
          } else {
            this.errors.phone = "";
          }
          break;
        case "personIdentification":
          if (!this.selectedUser.PersonIdentification) {
            this.errors.personIdentification =
              "Es necesario ingresar la cédula de identidad.";
          } else if (!this.validateEcuadorianID(this.selectedUser.PersonIdentification)) {
            this.errors.personIdentification = "Cédula inválida.";
          } else {
            this.errors.personIdentification = "";
          }
          break;
      }
    },
    validateFieldsCreate() {
      this.validateFieldCreate("name");
      this.validateFieldCreate("email");
      this.validateFieldCreate("bornDate");
      this.validateFieldCreate("password");
      this.validateFieldCreate("confirmPassword");
      this.validateFieldCreate("address");
      this.validateFieldCreate("phone");
      this.validateFieldCreate("personIdentification");
    },
    validateFieldsUpdate() {
      this.validateFieldUpdate("name");
      this.validateFieldUpdate("email");
      this.validateFieldUpdate("bornDate");
      this.validateFieldUpdate("address");
      this.validateFieldUpdate("phone");
      this.validateFieldUpdate("personIdentification");
    },
    goBack() {
      this.$router.push("/admin/home");
    },
    async submitUser() {
      this.validateFieldsCreate();

      if (Object.keys(this.errors).some((key) => this.errors[key])) return;

      const result = await this.$swal({
        title: "¿Estás seguro de crear un nuevo usuario?",
        icon: "question",
        text: "Se creará el nuevo usuario según lo especificado. Luego podrás modificarlo o eliminarlo según tus necesidades.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        console.log("this.newUser in create: ", this.newUser);
        this.newUser = {
          name: this.newUser.Name,
          email: this.newUser.Email,
          password: this.newUser.Password,
          bornDate: this.newUser.BornDate,
          address: this.newUser.Address,
          cellphone: this.newUser.Cellphone,
          rolID: this.newUser.RolID,
          personIdentification: this.newUser.PersonIdentification,
        };
        const resCreated = await registerUser(this.newUser);
        console.log("resCreated en creación de usuario: ", resCreated);
        if (resCreated.status) {
          await this.$swal({
            title: "¡El usuario ha sido creado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
            html: `<p style="color: gray; font-size: 14px;">Resultado</p> <strong>${resCreated.data.msg}</strong>`,
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo crear el usuario.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: resCreated.error.response.request.response,
          });
        }
        this.newUser = { Name: "", Email: "", RolID: "" };
        this.users = await fetchUsers();
        this.users = this.users.data;
        this.currentView = "viewUsers";
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
      }
    },
    async deleteUser(userId) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar el usuario?",
        icon: "question",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        const resDeleted = await deleteUser(userId);
        console.log("resDeleted: ", resDeleted);
        if (resDeleted.status) {
          await this.$swal({
            title: "¡El usuario ha sido eliminado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo eliminar el usuario.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: resDeleted.error.response.request.response,
          });
        }

        this.users = await fetchUsers();
        this.users = this.users.data;
      } else {
        await this.$swal({
          title: "¡No se prosigue por cancelación del usuario!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "OK",
        });
      }
    },
    editUser(user) {
      console.log("user in editUser: ", user);
      this.selectedUser = { ...user };
      this.currentView = "editUser";
    },
    async updateUserMethod() {
      this.validateFieldsUpdate();

      if (Object.keys(this.errorsUpdate).some((key) => this.errorsUpdate[key])) return;

      const result = await this.$swal({
        title: "¿Estás seguro de modificar el usuario?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      });

      //Comprobar respuesta
      if (result.isConfirmed) {
        console.log("updateUserMethod");
        console.log("this.selectedUser.UserID: ", this.selectedUser.UserID);
        console.log("this.selectedUser: ", this.selectedUser);
        const redUpdated = await updateUser(
          this.selectedUser.UserID,
          this.selectedUser
        );
        if (redUpdated.status) {
          await this.$swal({
            title: "¡El usuario ha sido editado satisfactoriamente!",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK",
          });
        } else {
          await this.$swal({
            title: "Ha ocurrido un error y no se pudo editar el usuario.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            text: redUpdated.error.response.request.response,
          });
        }

        this.users = await fetchUsers();
        this.users = this.users.data;
        this.currentView = "viewUsers";
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
.error-text {
  color: red;
  font-size: 0.9em;
  margin-top: 4px;
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

.btns {
  display: flex;
  justify-content: space-around;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.manage-users {
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

.user-list table {
  width: 100%;
  border-collapse: collapse;
}

.user-list th,
.user-list td {
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

/* .edit-btn {
  background: #4caf50;
  color: white;
  border: none;
}

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
} */
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

.user-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-form h2 {
  text-align: center;
  color: #333;
}

.user-form label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.user-form input,
.user-form select,
.user-form textarea {
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
  background-color: #28a745;
}
</style>
