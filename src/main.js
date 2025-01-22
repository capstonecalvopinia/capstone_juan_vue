import { createApp } from 'vue'
import App from './App.vue'

import router from "./router";

//Store pinia
import { createPinia } from 'pinia'

// vueSweetAlert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

//Íconos
import { Icon } from '@iconify/vue';

const app = createApp(App); 

app.component('Icon-Iconify', Icon)

app.use(createPinia())

app.use(VueSweetalert2);

app.use(router);

app.mount('#app');
