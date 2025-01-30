<template>
  <div class="manage-requests">
    <!-- Sidebar de opciones -->
    <aside class="sidebar">
      <h2>Panel Admin</h2>
      <ul>
        <li @click="currentView = 'viewRequests'">Ver Solicitudes</li>
        <li @click="currentView = 'addRequest'">Añadir Nueva Solicitud</li>
      </ul>
    </aside>

    <!-- Contenido principal -->
    <main class="content">
      <!-- Header -->
      <header class="header">
        <button class="icon-button" @click="goBack()">
          <Icon-Iconify class="icon" icon="icon-park-twotone:back" />
        </button>
        <h1>Gestión de Solicitudes</h1>
        <p>Administra y configura las solicitudes registradas</p>
      </header>

      <!-- Vista para ver y gestionar solicitudes -->
      <section v-if="currentView === 'viewRequests'" class="request-list">
        <h2>Solicitudes Existentes</h2>
        <!-- Barra de búsqueda -->
        <div id="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar por ID de solicitud o Cliente"
            class="search-bar"
          />
          <button class="see-all-btn" @click="changeList()">
            Alternar Lista
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Prioridad</th>
              <th>Tipo</th>
              <th>Dirección</th>
              <th>Estado Pago</th>
              <th>Estado Pedido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in filteredRequests" :key="request.RequestID">
              <td>{{ request.RequestID }}</td>
              <td>{{ request.User_UserName }}</td>
              <td>{{ request.Priority_Name }}</td>
              <td>{{ request.RequestType_Name }}</td>
              <td>{{ request.Address }}</td>
              <td>{{ request.PaymentState_Name }}</td>
              <td>{{ getRequestTypeById(lastRequestState(request)) }}</td>
              <td class="btns">
                <button
                  class="show-btn"
                  @click="goToShowRequest(request.RequestID)"
                >
                  Detalle
                </button>
                <button class="edit-btn" @click="editRequest(request)">
                  Editar
                </button>
                <button
                  class="delete-btn"
                  @click="deleteRequest(request.RequestID)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Formulario para agregar nueva solicitud -->
      <section v-if="currentView === 'addRequest'" class="request-form">
        <h2>Añadir Nueva Solicitud</h2>
        <form @submit.prevent="submitRequest">
          <label for="UserID">Usuario ID</label>
          <input v-model="newRequest.UserID" required type="number" />

          <label for="PriorityID">Prioridad ID</label>
          <input v-model="newRequest.PriorityID" required type="number" />

          <label for="RequestTypeID">Tipo de Solicitud ID</label>
          <input v-model="newRequest.RequestTypeID" required type="number" />

          <label for="Address">Dirección</label>
          <input v-model="newRequest.Address" required type="text" />

          <button type="submit" class="add-btn">Añadir Solicitud</button>
        </form>
      </section>

      <!-- Formulario para editar solicitud existente -->
      <section v-if="currentView === 'editRequest'" class="request-form">
        <h2>Editar Solicitud</h2>
        <form @submit.prevent="updateRequestMethod" class="info-general">
          <!-- Campo para editar Request State -->
          <label for="RequestStateID">Estado de la Solicitud</label>
          <select v-model="selectedRequest.RequestStateID" required>
            <option
              v-for="state in requestStates"
              :key="state.RequestStateID"
              :value="state.RequestStateID"
            >
              {{ state.Name }}
            </option>
          </select>

          <!-- Campo para editar Request Type -->
          <label for="RequestTypeID">Tipo de Solicitud</label>
          <select v-model="selectedRequest.RequestTypeID" required>
            <option
              v-for="type in requestTypes"
              :key="type.RequestTypeID"
              :value="type.RequestTypeID"
            >
              {{ type.Name }}
            </option>
          </select>

          <button type="submit" class="update-btn">Actualizar Solicitud</button>
        </form>

        <h2>Editar Estado del Pago</h2>
        <form
          @submit.prevent="updateRequestPaymentStateMethod"
          class="info-general"
        >
          <label><strong>Tipo de Pago</strong></label>
          <p>
            {{ selectedRequest.PaymentType_Name }}
          </p>

          <!-- Campo para editar Payment State -->
          <label for="PaymentStateID">Estado del Pago</label>
          <select v-model="selectedRequest.PaymentStateID" required>
            <option
              v-for="type in paymentStates"
              :key="type.PaymentStateID"
              :value="type.PaymentStateID"
            >
              {{ type.Name }}
            </option>
          </select>

          <button v-if="user.rolID == 3" type="submit" class="update-btn">
            Actualizar Estado Pago
          </button>
          <div v-else>
            <!-- <label
              >La actualizaciónd de pagos solo está disponible para
              administradores financieros</label
            > -->
            <p>
              La actualización de pagos solo está disponible para
              administradores financieros
            </p>

            <button
              type="submit"
              class="update-btn"
              id="checkout-btn-false"
              disabled
            >
              Actualizar Estado Pago
            </button>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import {
  getAllRequests,
  createRequest,
  updateRequest,
  updateRequestPaymentState,
  deleteRequest,
} from "../../services/requestService";

import { fetchRequestStates } from "../../services/requestStateService.js";
import { getAllRequestTypes } from "../../services/requestTypeService.js";
import { getAllPaymentStates } from "../../services/paymentStateService.js";
import { useUserStore } from "../../pluggins/stores/userStore.js";

export default {
  data() {
    return {
      requests: [],
      originalRequests: [],
      requestsByRol: [],
      requestsFlag: "by-rol",
      currentView: "viewRequests",
      newRequest: {
        UserID: "",
        PriorityID: "",
        RequestTypeID: "",
        Address: "",
      },
      selectedRequest: null,
      requestStates: [], // Aquí almacenarás los estados de la solicitud
      requestTypes: [], // Aquí almacenarás los tipos de solicitud
      paymentStates: [],
      user: {},
      searchQuery: "",
    };
  },
  computed: {
    filteredRequests() {
      const query = this.searchQuery.toLowerCase();
      console.log("Search query:", query); 

      return this.requests.filter((request) => {
        const clientName = request.User_UserName
          ? request.User_UserName.toLowerCase()
          : ""; 
        const requestId = request.RequestID ? request.RequestID.toString() : ""; 

        console.log("Request:", request);
        console.log("Client name:", clientName);
        console.log("Request ID:", requestId);

        return clientName.includes(query) || requestId.includes(query); // Filtra según el nombre o el ID
      });
    },
  },
  beforeUpdate() {
    const userStore = useUserStore();

    this.user = userStore.getUser;
    console.log("beforeUpdate this.user: ", this.user);
  },
  mounted() {
    const userStore = useUserStore();

    this.user = userStore.getUser;
    console.log("mounted this.user: ", this.user);
  },
  setup() {
    const userStore = useUserStore();

    //this.user = userStore.getUser;

    return {
      userStore,
    };
  },
  async created() {
    let resRequests = await getAllRequests();
    console.log("resRequests.data: ", resRequests.data);
    this.originalRequests = resRequests.data;
    let requestStates = [];
    if (this.user.rolName == "ADMIN") {
      requestStates = [1, 2];
    } else if (this.user.rolName == "FINANCIERO") {
      requestStates = [1, 2, 4];
    } else if (this.user.rolName == "BODEGUERO") {
      requestStates = [3, 5];
    } else if (this.user.rolName == "REPARTIDOR") {
      requestStates = [6, 8];
    }
    //1 ADMIN
    //3 FINANCIERO
    //4 BODEGUERO
    //5 REPARTIDOR
    resRequests.data = this.filterOrdersByLastState(
      resRequests.data,
      requestStates
    );
    this.requestsFlag = "by-rol",
    this.requestsByRol = resRequests.data;


    console.log("resRequests post: ", resRequests);

    const resStates = await fetchRequestStates(); // Función para obtener los estados
    const resTypes = await getAllRequestTypes(); // Función para obtener los tipos
    const resPaymentStates = await getAllPaymentStates();

    console.log("resStates: ", resStates);
    console.log("resPaymentStates: ", resPaymentStates);

    if (resPaymentStates.status) {
      this.paymentStates = resPaymentStates.data;
      console.log("this.paymentStates.data en if: ", this.paymentStates);
    }

    if (resRequests.status) {
      this.requests = resRequests.data;
    }

    if (resStates.status) {
      this.requestStates = resStates.data;
    }

    if (resTypes.status) {
      this.requestTypes = resTypes.data;
    }
  },
  methods: {
    changeList(){
      if(this.requestsFlag == "by-rol"){
        this.requests = this.originalRequests;
        this.requestsFlag = "original"
      }else{
        this.requests = this.requestsByRol;
        this.requestsFlag = "by-rol"
      }
      
    },
    filterOrdersByLastState(orders, validStateIDs) {
      // Verifica que orders sea un arreglo
      if (!Array.isArray(orders)) {
        console.error("El parámetro 'orders' no es un arreglo:", orders);
        return [];
      }

      return orders.filter((order) => {
        const lastState = order.RequestStates?.at(-1); // Obtén el último estado (maneja undefined)
        if (!lastState) return false; // Excluir pedidos sin estados

        // Verifica si el último estado está en el arreglo de IDs válidos
        return validStateIDs.includes(lastState.RequestStateID);
      });
    },

    goBack() {
      this.$router.push("/admin/home");
    },
    lastRequestState(order) {
      console.log("lastRequestState order: ");
      return order.RequestStates.at(-1) || null; // Devuelve el último estado o null si no hay elementos
    },
    getRequestTypeById(req) {
      let id = req.RequestStateID;
      let name = "";
      this.requestStates.forEach((requestState) => {
        if (requestState.RequestStateID == id) {
          console.log("requestState: ", requestState);
          console.log("id: ", id);
          name = requestState.Name;
        }
      });
      console.log("return name: ", name);
      return name;
    },
    goToShowRequest(id) {
      this.$router.push({ name: "showRequest", params: { id } });
    },
    async submitRequest() {
      const result = await this.$swal({
        title: "¿Estás seguro de crear una nueva solicitud?",
        icon: "question",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        const resCreated = await createRequest(this.newRequest);

        if (resCreated.status) {
          await this.$swal({
            title: "¡Solicitud creada satisfactoriamente!",
            icon: "success",
          });
          const res = await getAllRequests();
          this.requests = res.status ? res.data : [];
          this.newRequest = {
            UserID: "",
            PriorityID: "",
            RequestTypeID: "",
            Address: "",
          };
          this.currentView = "viewRequests";
        } else {
          await this.$swal({
            title: "Error al crear la solicitud",
            icon: "error",
            text: resCreated.msg,
          });
        }
      }
    },
    async deleteRequest(RequestID) {
      const result = await this.$swal({
        title: "¿Estás seguro de eliminar la solicitud?",
        icon: "warning",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        const resDeleted = await deleteRequest(RequestID);

        if (resDeleted.status) {
          await this.$swal({
            title: "¡Solicitud eliminada!",
            icon: "success",
          });
          const res = await getAllRequests();
          this.requests = res.status ? res.data : [];
        } else {
          await this.$swal({
            title: "Error al eliminar la solicitud",
            icon: "error",
            text: resDeleted.msg,
          });
        }
      }
    },
    editRequest(request) {
      this.selectedRequest = { ...request };
      this.selectedRequest.RequestStateID = this.lastRequestState(
        this.selectedRequest
      )?.RequestStateID;
      this.currentView = "editRequest";

      console.log("this.selectedRequest: ", this.selectedRequest);
    },
    async updateRequestMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar esta solicitud?",
        icon: "question",
        showCancelButton: true,
      });
      console.log("this.selectedRequest: ", this.selectedRequest);

      this.selectedRequest.RequestStateID = this.lastRequestState(
        this.selectedRequest
      )?.RequestStateID;
      console.log("this.selectedRequest post: ", this.selectedRequest);
      if (result.isConfirmed) {
        //se validan los roles para el cambio de estados:

        //para el administrador (1)
        //y para actualizaciones "Pedido Realizado", "Validando Órden" (1 y 2)
        if (
          this.selectedRequest.RequestStateID == 1 ||
          this.selectedRequest.RequestStateID == 2
        ) {
          //id 4 es admin
          if (this.user.userID != 1) {
            let textMsg =
              "El rol del usuario no tiene permitido cambiar el estado del pedido a: " +
              this.selectedRequest.RequestState_Name;
            await this.$swal({
              title: "Rol sin permisos",
              icon: "error",
              text: textMsg,
            });
            return;
          }
        }

        //para el financiero (3)
        //y para actualizaciones "Órden validada" y "Pago erróneo" (3 y 4)
        if (
          this.selectedRequest.RequestStateID == 3 ||
          this.selectedRequest.RequestStateID == 4
        ) {
          //id 3 es financiero
          if (this.user.userID != 3) {
            let textMsg =
              "El rol del usuario no tiene permitido cambiar el estado del pedido a: " +
              this.selectedRequest.RequestState_Name;
            await this.$swal({
              title: "Rol sin permisos",
              icon: "error",
              text: textMsg,
            });
            return;
          }
        }

        //para el bodeguero (4)
        //y para actualizaciones "Preparando Órden" y "Órden En Reparto" (5 y 6)
        if (
          this.selectedRequest.RequestStateID == 5 ||
          this.selectedRequest.RequestStateID == 6
        ) {
          //id 4 es bodeguero
          if (this.user.userID != 4) {
            let textMsg =
              "El rol del usuario no tiene permitido cambiar el estado del pedido a: " +
              this.selectedRequest.RequestState_Name;
            await this.$swal({
              title: "Rol sin permisos",
              icon: "error",
              text: textMsg,
            });
            return;
          }
        }

        //para el repartidor (5)
        //y para actualizaciones "Órden Entregada" y "Orden No Entregada" (7 y 8)
        if (
          this.selectedRequest.RequestStateID == 7 ||
          this.selectedRequest.RequestStateID == 8
        ) {
          // 5 = repartidor
          if (this.user.userID != 5) {
            let textMsg =
              "El rol del usuario no tiene permitido cambiar el estado del pedido a: " +
              this.selectedRequest.RequestState_Name;
            await this.$swal({
              title: "Rol sin permisos",
              icon: "error",
              text: textMsg,
            });
            return;
          }
        }

        // Solo actualizamos los campos de RequestStateID y RequestTypeID
        const updatedData = {
          RequestStateID: this.selectedRequest.RequestStateID,
          RequestTypeID: this.selectedRequest.RequestTypeID,
        };
        console.log("updatedData: ", updatedData);
        const resUpdated = await updateRequest(
          this.selectedRequest.RequestID,
          updatedData
        );

        console.log("resUpdated: ", resUpdated);

        if (resUpdated.status) {
          await this.$swal({
            title: "¡Solicitud actualizada!",
            icon: "success",
          });
          const res = await getAllRequests();
          this.requests = res.status ? res.data : [];
          this.currentView = "viewRequests";
        } else {
          await this.$swal({
            title: "Error al actualizar la solicitud",
            icon: "error",
            text: resUpdated.msg,
          });
        }
      }
    },
    async updateRequestPaymentStateMethod() {
      const result = await this.$swal({
        title: "¿Estás seguro de modificar el estado de pago de la solicitud?",
        icon: "question",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        // Solo actualizamos los campos de RequestStateID y RequestTypeID
        const updatedData = {
          PaymentStateID: this.selectedRequest.PaymentStateID,
        };
        console.log("updatedData: ", updatedData);
        const resUpdated = await updateRequestPaymentState(
          this.selectedRequest.RequestID,
          updatedData
        );

        console.log("resUpdated payment state: ", resUpdated);

        if (resUpdated.status) {
          await this.$swal({
            title: "¡Estado de pago actualizado!",
            icon: "success",
          });
          const res = await getAllRequests();
          this.requests = res.status ? res.data : [];
          this.currentView = "viewRequests";
        } else {
          await this.$swal({
            title: "Error al actualizar el estado de pago",
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
#search-container {
  display: flex;

  align-items: center;
  justify-content:space-between;
}

.see-all-btn {
  
  width: 12% !important;
  background-color: #018c91;
  color: white;
}

.see-all-btn:hover {
  background-color: #015154;
}

.search-bar {
  width: 85% !important;
  padding: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

#checkout-btn-false {
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
  width: 100%;
  padding: 10px;
  background-color: #bcc1c2;
  color: white;
  border: none;
  border-radius: 4px;

  font-weight: bold;
}
/* Estilos generales */
.manage-requests {
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
  color: white;
}

.sidebar ul {
  list-style: none;
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

.request-list,
.request-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  color: black;
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
  background-color: #34495e;
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

.btns {
  display: flex;
  justify-content: space-around;
}

.show-btn {
  background-color: #018c91;
  color: white;
}

.show-btn:hover {
  background-color: #015154;
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

th {
  background-color: #018c91;
  color: white;
}

.add-btn,
.update-btn {
  background-color: #018c91;
  color: white;
}

.add-btn:hover,
.update-btn:hover {
  background-color: rgb(60, 174, 189);
}

input[type="text"],
textarea,
select {
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
  max-width: 800px;
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

.table-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.info-general p {
  margin: 0;
  font-size: 1rem;
  background: #fff;
  padding: 0.8rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
