import { createRouter, createWebHistory } from "vue-router";
import Auth from "./views/AuthView.vue";
import HomeView from "./views/HomeView.vue";
import RegisterComponent from "./components/auth/RegisterComponent.vue";
import HomeAdmin from "./views/admin/HomeAdmin.vue";
import ManageRols from "./views/admin/manageRols.vue";
import ManageUsers from "./views/admin/manageUsers.vue";
import ManageUnits from "./views/admin/manageUnits.vue";
import ManageProducts from "./views/admin/manageProducts.vue";
import ManagePaymentTypes from "./views/admin/managePaymentTypes.vue";
import ManagePriorities from "./views/admin/managePriorities.vue";
import ManageRequestType from "./views/admin/manageRequestType.vue";
import ManageRequests from "./views/admin/manageRequests.vue";
import CartView from "./views/user/CartView.vue";
import PurchaseView from "./views/user/PurchaseView.vue";
import ShowRequest from "./views/admin/showRequest.vue";
import PaymentTutorial from "./views/user/PaymentTutorial.vue";
import RecipeDetailView from "./views/user/RecipeDetailView.vue";

//productos
import ProductView from "./views/user/ProductView.vue";

//requests
import RequestsListView from "./views/user/RequestsListView.vue";
import RequestView from "./views/user/RequestView.vue";

import Swal from "sweetalert2"; // Asegúrate de que SweetAlert2 esté importado

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/PurchaseView",
    name: "PurchaseView",
    component: PurchaseView,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/paymentTutorial/:RequestID/:PaymentType",
    name: "PaymentTutorial",
    component: PaymentTutorial,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/auth/Register",
    name: "AuthRegister",
    component: RegisterComponent,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/admin/home",
    name: "HomeAdmin",
    component: HomeAdmin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/manageRols",
    name: "ManageRols",
    component: ManageRols,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/manageUsers",
    name: "ManageUsers",
    component: ManageUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/manageUnits",
    name: "ManageUnits",
    component: ManageUnits,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/manageProducts",
    name: "ManageProducts",
    component: ManageProducts,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/managePaymentTypes",
    name: "ManagePaymentTypes",
    component: ManagePaymentTypes,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/managePriorities",
    name: "managePriorities",
    component: ManagePriorities,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/manageRequestType",
    name: "manageRequestType",
    component: ManageRequestType,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/manageRequests",
    name: "manageRequests",
    component: ManageRequests,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/showRequest/:id",
    name: "showRequest",
    component: ShowRequest,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  //Producto
  {
    path: "/product/details/:id/:backRoute",
    name: "ProductDetails",
    component: ProductView,
    meta: { requiresAuth: false, requiresAdmin: false },
  },
  {
    path: "/requests/list",
    name: "RequestsList",
    component: RequestsListView,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/requests/:id",
    name: "Request",
    component: RequestView,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
  {
    path: "/recipe/:recipe/:originalProduct",
    name: "RecipeDetail",
    component: RecipeDetailView,
    meta: { requiresAuth: true, requiresAdmin: false },
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Si el usuario vuelve a una página, ir a la posición guardada
    } else if (to.hash) {
      return {
        el: to.hash, // Desplazarse al id (hash) de la página
        behavior: "smooth", // Desplazamiento suave
      };
    } else {
      return { top: 0 }; // Ir al inicio de la página si no hay hash
    }
  },
});

import { useUserStore } from "./pluggins/stores/userStore.js";

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  console.log("requiresAuth: ", requiresAuth);
  console.log("requiresAdmin: ", requiresAdmin);

  if (requiresAuth || requiresAdmin) {
    const store = useUserStore();
    const user = store.getUser;
    console.log("User at router: ", user);

    //Verificar si se va a la ruta de
    console.log("to: ", to);
    if (to.fullPath == "/PurchaseView" || to.fullPath == "/cart") {
      if (!user.name) {
        const res = await ShowMessage();
        console.log("res: ", res);

        next("/auth");
      } else {
        next();
      }
    }

    if (!user.name && requiresAuth) {
      next("/auth");
    } else if (user.rolID == 2 && requiresAdmin) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

// Función para solicitar la contraseña
async function ShowMessage() {
  const res = await Swal.fire({
    title: "Ingreso Direccion de Envío",
    icon: "warning",
    text: "Por favor, para ingresar la dirección de envío en el carrito de compras debe encontrarse identificado el sistema. Inicie sesión antes de continuar.",
    // showCancelButton: true,
    confirmButtonText: "Continuar",
  });

  return res; // Devuelve la contraseña ingresada
}
export default router;
