import { createApp } from 'vue';
import Toast from 'vue-toastification';
import type { PluginOptions as ToastPluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from '@/App.vue';
import '@/apollo.js';
import '@/assets/main.css';
import router from '@/router';

const app = createApp(App);

app.use(router);
app.use(Toast, <ToastPluginOptions>{
  position: 'bottom-center',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
});

app.mount('#app');
