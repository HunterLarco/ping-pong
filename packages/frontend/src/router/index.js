import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/host/:gameId',
      name: 'host',
      component: () => import('@/views/HostView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

router.beforeEach(async (to) => {
  const authToken = localStorage.getItem('authorization');
  if (!authToken && to.path.startsWith('/join')) {
    return '/login';
  }
});

export default router;
