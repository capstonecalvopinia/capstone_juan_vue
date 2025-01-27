<template>
  <div class="register-container">
    <!-- Sección del formulario de registro -->
    <div class="register-form">
      <h1>Registro de Usuario<br />Frish Alimentos Congelados</h1>
      <form id="registerFormId" @submit.prevent="handleRegister">
        <label for="name">Nombre</label>
        <input
          type="text"
          id="name"
          placeholder="Nombre"
          v-model="name"
          @blur="validateField('name')"
          required
        />
        <p v-if="errors.name" class="error-text">{{ errors.name }}</p>

        <label for="email">Correo</label>
        <input
          type="email"
          id="email"
          placeholder="Correo"
          v-model="email"
          @blur="validateField('email')"
          required
        />
        <p v-if="errors.email" class="error-text">{{ errors.email }}</p>

        <label for="bornDate">Fecha de Nacimiento</label>
        <input
          type="date"
          id="bornDate"
          v-model="bornDate"
          @blur="validateField('bornDate')"
          required
        />
        <p v-if="errors.bornDate" class="error-text">{{ errors.bornDate }}</p>

        <label for="password">Contraseña</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Contraseña"
            v-model="password"
            @blur="validateField('password')"
            required
          />
          <span @click="togglePassword" class="toggle-password-icon">👁️</span>
        </div>
        <p v-if="errors.password" class="error-text">{{ errors.password }}</p>

        <label for="confirmPassword">Confirmar Contraseña</label>
        <div class="password-container">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            placeholder="Confirmar Contraseña"
            v-model="confirmPassword"
            @blur="validateField('confirmPassword')"
            required
          />
          <span @click="toggleConfirmPassword" class="toggle-password-icon">👁️</span>
        </div>
        <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>

        <label for="address">Dirección</label>
        <input
          type="text"
          id="address"
          placeholder="Dirección"
          v-model="address"
          @blur="validateField('address')"
          required
        />
        <p v-if="errors.address" class="error-text">{{ errors.address }}</p>

        <label for="phone">Número de Celular</label>
        <input
          type="tel"
          id="phone"
          placeholder="Número de Celular"
          v-model="phone"
          @blur="validateField('phone')"
          required
        />
        <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>

        <label for="personID">Cédula de Identidad</label>
        <input
          type="text"
          id="personID"
          placeholder="Cédula de Identidad"
          v-model="personIdentification"
          @blur="validateField('personIdentification')"
          required
        />
        <p v-if="errors.personIdentification" class="error-text">
          {{ errors.personIdentification }}
        </p>

        <button type="submit" class="register-button">Registrar</button>
        <p class="login-text">
          ¿Ya tienes una cuenta? <a href="/auth" class="login-link">Acceder</a>
        </p>
      </form>
    </div>
    <!-- Sección de la imagen a la derecha -->
    <div class="register-image">
      <div class="image-placeholder">
        <img class="image-logo" src="../../assets/Frish Blue.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from "../../services/userService.js";

export default {
  name: "RegisterComponent",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      bornDate: "",
      address: "",
      phone: "",
      rolID: 2,
      personIdentification: "",
      showPassword: false,
      showConfirmPassword: false,
      errors: {},
    };
  },
  methods: {
    validateField(field) {
      // Valida un campo individual
      switch (field) {
        case "name":
          this.errors.name = this.name ? "" : "Es necesario ingresar el nombre.";
          break;
        case "email":
          if (!this.email) {
            this.errors.email = "Es necesario ingresar el correo.";
          } else if (!/\S+@\S+\.\S+/.test(this.email)) {
            this.errors.email = "Formato de correo inválido.";
          } else {
            this.errors.email = "";
          }
          break;
        case "bornDate":
          if (!this.bornDate) {
            this.errors.bornDate = "Es necesario ingresar la fecha de nacimiento.";
          } else if (new Date(this.bornDate) >= new Date()) {
            this.errors.bornDate = "La fecha de nacimiento debe ser en el pasado.";
          } else {
            this.errors.bornDate = "";
          }
          break;
        case "password":
          this.errors.password = this.password ? "" : "Es necesario ingresar la contraseña.";
          break;
        case "confirmPassword":
          if (!this.confirmPassword) {
            this.errors.confirmPassword = "Por favor, confirme la contraseña.";
          } else if (this.password !== this.confirmPassword) {
            this.errors.confirmPassword = "Las contraseñas no coinciden.";
          } else {
            this.errors.confirmPassword = "";
          }
          break;
        case "address":
          this.errors.address = this.address ? "" : "Es necesario ingresar la dirección.";
          break;
        case "phone":
          if (!this.phone) {
            this.errors.phone = "Es necesario ingresar el número celular.";
          } else if (!/^\d{10}$/.test(this.phone)) {
            this.errors.phone = "El número de celular debe tener 10 dígitos.";
          } else {
            this.errors.phone = "";
          }
          break;
        case "personIdentification":
          if (!this.personIdentification) {
            this.errors.personIdentification = "Es necesario ingresar la cédula de identidad.";
          } else if (!this.validateEcuadorianID(this.personIdentification)) {
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
    validateFields() {
      this.validateField("name");
      this.validateField("email");
      this.validateField("bornDate");
      this.validateField("password");
      this.validateField("confirmPassword");
      this.validateField("address");
      this.validateField("phone");
      this.validateField("personIdentification");
    },
    async handleRegister() {
      this.validateFields();

      if (Object.keys(this.errors).some((key) => this.errors[key])) return;

      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        bornDate: this.bornDate,
        address: this.address,
        cellphone: this.phone,
        rolID: this.rolID,
        personIdentification: this.personIdentification,
      };

      const res = await registerUser(userData);
      if (res.status) {
        await this.$swal({
          title: "El usuario se ha registrado con éxito.",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.$router.push("/");
      } else {
        await this.$swal({
          title: "Ha ocurrido un error al registrar al usuario.",
          icon: "error",
          text: res.error,
        });
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
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

#registerFormId{
  display: inline;
  padding: 0px;
  box-shadow: none;
  margin: 0px;
  max-width: none;
}

.register-container {
  display: flex;
  width: 100%;
  height: 110vh;
  background-color: #e0f7f4;
}

.register-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background-color: #fff;
  color: #333;
  position: relative;
}

.register-form h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.register-form label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.register-form input[type="text"],
.register-form input[type="email"],
.register-form input[type="tel"],
.register-form input[type="password"],
.register-form input[type="date"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.password-container {
  position: relative;
}

.toggle-password-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}

.register-button {
  width: 100%;
  padding: 12px;
  background-color: #018c91;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-text {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}

.login-link {
  color: #ff6f61;
  font-weight: bold;
  text-decoration: none;
}

.register-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #018c91;
  color: #fff;
}

.image-placeholder {
  text-align: center;
  font-size: 24px;
  color: #fff;
  /* border: 2px dashed #fff; */
  padding: 30px;
  border-radius: 10px;
}

.image-logo{
  width: 100%;
}

</style>
