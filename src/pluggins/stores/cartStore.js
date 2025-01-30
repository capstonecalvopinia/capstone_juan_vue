import { defineStore } from "pinia";

export const useCartStore = defineStore({
  id: "cart",
  state: () => ({
    cart: (() => {
      try {
        return (
          JSON.parse(localStorage.getItem("cart")) || {
            userID: null,
            priorityID: null,
            requestTypeID: null,
            paymentTypeID: null,
            address: "",
            requestedDate: null,
            requestedToDate: null,
            deliveredDate: null,
            products: [],
            Total: 0
          }
        );
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return {
          userID: null,
          priorityID: null,
          requestTypeID: null,
          paymentTypeID: null,
          address: "",
          requestedDate: null,
          requestedToDate: null,
          deliveredDate: null,
          products: [],
          Total: 0
        };
      }
    })(),
  }),
  getters: {
    getCart: (state) => state.cart,
  },
  actions: {
    // Establece el carrito completo
    setCart(cart) {
      console.log("Cart recibido en store:", cart);

      this.cart = cart;

      try {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Datos del carrito guardados en localStorage:", cart);
      } catch (error) {
        console.error("Error guardando el carrito en localStorage:", error);
      }
    },

    // Limpia todo el carrito
    clearCart() {
      this.cart = {
        userID: null,
        priorityID: null,
        requestTypeID: null,
        paymentTypeID: null,
        address: "",
        requestedDate: null,
        requestedToDate: null,
        deliveredDate: null,
        products: [],
        requestStateID: null,
        Total: 0
      };

      try {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        console.log("Carrito limpiado y guardado en localStorage:", this.cart);
      } catch (error) {
        console.error("Error guardando el carrito en localStorage:", error);
      }
    },

    // Agrega un nuevo producto al carrito
    addProduct(product) {
      if (typeof this.cart.Total !== "number" || isNaN(this.cart.Total)) {
        console.log("cart.Total no es un número válido en addProduct en store.");
        this.cart.Total = 0;
      } else {
        console.log("cart.Total es un número válido  en addProduct en store.");
  
      }

      console.log("Agregando producto al carrito:", product);
      console.log("this.cart en agregando proudcto al carrito: ", this.cart);

      // Verifica si ya existe el producto
      const existingProduct = this.cart.products.find(
        (p) => p.productID === product.productID
      );

      if (existingProduct) {
        // Si existe, incrementa la cantidad
        existingProduct.quantity += product.quantity;
        this.cart.Total += product.price * product.quantity;
        console.log("Producto existente actualizado:", existingProduct);
      } else {
        // Si no existe, agrégalo al carrito
        this.cart.products.push(product);
        console.log("Producto agregado al carrito:", product);
        this.cart.Total += product.price * product.quantity;
      }

      this.saveCart();
    },

    // Elimina un producto del carrito
    removeProduct(productID) {
      console.log("Eliminando producto del carrito con ID:", productID);

      // Filtra los productos para eliminar el producto especificado
      this.cart.products = this.cart.products.filter(
        (product) =>{
          product.productID !== productID;
          this.cart.Total -= product.price * product.quantity;
        } 
      );

      this.saveCart();
    },

    // Guarda el carrito en el localStorage
    saveCart() {
      try {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        console.log("Carrito actualizado guardado en localStorage:", this.cart);
      } catch (error) {
        console.error("Error guardando el carrito en localStorage:", error);
      }
    },
  },
});
