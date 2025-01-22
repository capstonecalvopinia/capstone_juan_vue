<template>
  <!-- Aquí va el HTML del componente -->
   <LoginComponent v-if="inLogin"></LoginComponent>
   <RegisterComponent v-else></RegisterComponent>
</template>

<script>
import RegisterComponent from "../components/auth/RegisterComponent.vue";
import LoginComponent from '@/components/auth/LoginComponent.vue';

export default {
  // Aquí van las opciones del componente
  name: 'AuthView', // Nombre del componente
  components: {
    LoginComponent,
    RegisterComponent,
    
  },
  props: {
    // Definición de propiedades que el componente puede recibir
  },
  data() {
    // Datos reactivos del componente
    return {
      inLogin: true
    };
  },
  methods: {
    // Métodos del componente
  },
  computed: {
    // Propiedades computadas
  },
  mounted() {
    // Hook de ciclo de vida
  }
};
</script>

<style scoped>
/* Aquí van los estilos específicos del componente */
</style>