<template>
  <div id="login-container">
    <!-- Sección del formulario de inicio de sesión -->
    <div id="login-form">
      <h1>Acceso<br />Frish</h1>
      <form id="formLoginID" @submit.prevent="handleLogin">
        <label for="email">Correo</label>
        <input
          type="text"
          id="email"
          placeholder="email"
          v-model="email"
          @blur="validateField('email')"
          required
        />
        <p v-if="errors.email" class="error-text">{{ errors.email }}</p>

        <label for="password">Contraseña</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Password"
            v-model="password"
            @blur="validateField('password')"
            required
          />
          <span @click="togglePassword" class="toggle-password-icon">
            👁️
          </span>
        </div>
        <p v-if="errors.password" class="error-text">{{ errors.password }}</p>

        <a href="#" class="forgot-password">Olvidaste la contraseña?</a>
        <button type="submit" class="login-button">Acceder</button>
        <p class="register-text">
          ¿No tienes una cuenta? <a href="/auth/register" class="register-link">Registrar</a>
        </p>
      </form>
    </div>

    <!-- Sección de la imagen a la derecha -->
    <div class="login-image">
      <div class="image-placeholder">
        <img class="image-logo" src="../../assets/Frish Blue.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../../services/userService.js";

export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      errors: {},
    };
  },
  methods: {
    validateField(field) {
      // Validar un campo individual
      switch (field) {
        case "email":
          if (!this.email) {
            this.errors.email = "Es necesario ingresar el correo.";
          } else if (!/\S+@\S+\.\S+/.test(this.email)) {
            this.errors.email = "Formato de correo inválido.";
          } else {
            this.errors.email = "";
          }
          break;
        case "password":
          this.errors.password = this.password
            ? ""
            : "Es necesario ingresar la contraseña.";
          break;
      }
    },
    validateFields() {
      // Validar todos los campos
      this.validateField("email");
      this.validateField("password");
    },
    async handleLogin() {
      // Validar campos antes de enviar
      this.validateFields();

      // Si hay errores, no continuar
      if (Object.keys(this.errors).some((key) => this.errors[key])) return;

      // Lógica para procesar el inicio de sesión
      const res = await loginUser(this.email, this.password);
      if (res.status) {
        if (res.data.user.RolName == "USER") {
          this.$router.push("/");
        } else {
          this.$router.push("/admin/home");
        }
      } else {
        await this.$swal({
          title: "Credenciales incorrectas o usuario inexistente.",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
          text: res.error,
        });
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
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

#login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #e0f7f4;
}

#formLoginID{
  padding: 0px;
  margin: 0px;
  box-shadow: none;
}

#login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background-color: #fff;
  color: #333;
  position: relative;
}

#login-form h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

#login-form label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

#login-form input[type="text"],
#login-form input[type="password"] {
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

.forgot-password {
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-bottom: 20px;
  display: inline-block;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #1abc9c;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-text {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}

.register-link {
  color: #ff6f61;
  font-weight: bold;
  text-decoration: none;
}

.login-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2cb1a4;
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
