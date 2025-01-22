<template>
  <div class="container">
    <div class="container-left">
      <button class="icon-button" @click="goBack()">
        <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
      </button>
    </div>
    <div class="container-right">
      <div class="payment-validation-container">
        <h1 class="title">Validación de Pago</h1>
        <p class="request-info">
          Código del Pedido: <strong>{{ requestID }}</strong>
        </p>

        <div v-if="paymentType === 'Transferencia'" class="timeline">
          <div class="timeline-card">
            <h2>Paso 1: Realiza la Transferencia</h2>
            <p>
              Utiliza los siguientes datos bancarios para completar tu pago:
            </p>
            <p><strong>Banco:</strong> Banco Pichincha</p>
            <p><strong>Cuenta:</strong> 2205416275</p>
            <p><strong>Titular:</strong> Juan Calvopiña</p>
          </div>
          <div class="timeline-card">
            <h2>Paso 2: Envía el Comprobante</h2>
            <p>Envía el comprobante de tu transferencia al número:</p>
            <p><strong>0997612857</strong></p>
            <p>
              Incluye el código del pedido: <strong>{{ requestID }}</strong>
            </p>
          </div>
          <div class="timeline-card">
            <h2>Paso 3: Espera la Confirmación</h2>
            <p>
              Una vez validado el pago, se continuará con la gestión de tu
              pedido.
            </p>
          </div>
        </div>

        <div v-else-if="paymentType === 'Efectivo'" class="timeline">
          <div class="timeline-card">
            <h2>Paso 1: Acércate a Nuestro Punto de Cobro</h2>
            <p>Visita nuestra oficina en:</p>
            <p><strong>Dirección:</strong> Calle Principal 123, Ciudad XYZ</p>
          </div>
          <div class="timeline-card">
            <h2>Paso 2: Proporciona el Código del Pedido</h2>
            <p>
              Indica el código de tu pedido al cajero:
              <strong>{{ requestID }}</strong>
            </p>
          </div>
          <div class="timeline-card">
            <h2>Paso 3: Recibe tu Confirmación</h2>
            <p>
              Una vez realizado el pago, recibirás tu comprobante en el lugar y
              el proceso de entrega continuará.
            </p>
          </div>
        </div>

        <div v-else>
          <h2>Tipo de pago no reconocido</h2>
          <p>Por favor, verifica la información proporcionada.</p>
        </div>
      </div>
      <div class="buttonsContainer">
        <button type="submit" class="verify-btn" @click="verifyButtonMethod">
          Solicitar Verificación de Pago
        </button>

        <button type="submit" class="checkout-btn" @click="goToOrdersList">
          Finalizar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestPaymentVerify } from "../../services/requestService.js";

export default {
  name: "PaymentValidation",
  props: {},
  data() {
    return {
      requestID: this.$route.params.RequestID || "Desconocido",
      paymentType: this.$route.params.PaymentType || "Desconocido",
    };
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.push("/requests/list");
    },
    goToOrdersList() {
      this.$router.push("/requests/list");
    },
    async verifyButtonMethod() {
      const res = await this.$swal({
        title: "¿Solicitar verificación de pago?",
        icon: "success",
        showCancelButton: true, // Agregar botón de cancelar para la pregunta
        confirmButtonText: "Sí, solicitar revisión",
        cancelButtonText: "No, gracias",
        html: `
    <hr />
    <div style="text-align: center; font-size: 14px; color: #4a4a4a;">
      <p><strong>Identificador de la Orden:</strong> ${this.requestID}</p>
      <p><strong>Tipo de pago:</strong> ${this.paymentType}</p>
    </div>
  `,
      });

      console.log("verifyButtonMethod res", res);

      if (res.isConfirmed) {
        // Muestra el loading de SweetAlert
        this.$swal.fire({
          title: "Procesando...",
          text: "Por favor espera mientras se solicita la verificación de tu pago.",
          allowOutsideClick: false,
          didOpen: () => {
            this.$swal.showLoading(); // Muestra el spinner
          },
        });

        try {
          //se envía la solicitud
          const resVerifyRequest = await requestPaymentVerify({
            RequestID: this.requestID,
          });

          console.log("resVerifyRequest: ", resVerifyRequest);

          if (resVerifyRequest.status) {
            await this.$swal({
              title: "Solicitud Exitosa",
              icon: "success",
              text: "La solicitud de verificación del pago se envió exitosamente. Un administrador se encargará de validarlo.",
            });
          } else {
            await this.$swal({
              title: "Solicitud Fallida",
              icon: "error",
              text: "No se pudo solicitar la verificación del pago.",
            });
          }
        } catch (error) {
          // Cierra el loading y muestra un mensaje de error en caso de fallo
          this.$swal.close();
          console.error(error);
          this.$swal.fire({
            title: "Error",
            text: "Hubo un problema al solicitar la verificación de tu pago.",
            icon: "error",
          });
        }
      }
    },
  },
  mounted() {
    console.log("Parámetros recibidos:", this.requestID, this.paymentType);
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

.container {
  /* background-color: red; */
  display: flex;
}

.container-right {
  /* background-color: green; */
  width: 93%;
}

.container-left {
  /* background-color: rgb(152, 223, 52); */
  width: 7%;
  padding: 38px 0px 0px 0px;
}

.buttonsContainer {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}

.payment-validation-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
.request-info {
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
}
.timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.timeline-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.timeline-card h2 {
  margin: 0;
  font-size: 18px;
  color: #555;
}
.timeline-card p,
.timeline-card ul {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}
.timeline-card ul {
  list-style-type: none;
  padding: 0;
}
.timeline-card ul li {
  margin: 5px 0;
}

.checkout-btn {
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  width: 20%;
  padding: 10px;
  background-color: #018c91;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin: 15px 0px;
}

.verify-btn {
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  width: 20%;
  padding: 10px;
  background-color: #24b3b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin: 15px 0px;
}

.checkout-btn:hover {
  background-color: #24b3b8;
}

.verify-btn:hover {
  background-color: #018c91;
}
</style>
