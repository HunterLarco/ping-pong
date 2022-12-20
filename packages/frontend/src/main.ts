import { createApp } from 'vue';
import Toast from 'vue-toastification';
import type { PluginOptions as ToastPluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from '@/App.vue';
import '@/apollo';
import '@/assets/main.css';
import '@/assets/toast.scss';
import router from '@/router';

const app = createApp(App);

app.use(router);
app.use(Toast, <ToastPluginOptions>{
  closeButton: false,
  closeOnClick: true,
  containerClassName: 'ToastOverride',
  draggable: true,
  draggablePercent: 0.6,
  hideProgressBar: true,
  icon: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  position: 'bottom-center',
  rtl: false,
  showCloseButtonOnHover: false,
  timeout: 5000,
});

app.mount('#app');
