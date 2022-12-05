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
      path: '/join/:gameId',
      name: 'join',
      component: () => import('@/views/JoinView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

const guards = {
  join(to, from) {
    const authToken = localStorage.getItem('authorization');
    if (!authToken) {
      return `/login?to=${to.path}`;
    }
  },

  login(to, from) {
    const authToken = localStorage.getItem('authorization');
    if (authToken) {
      return `/`;
    }
  },
};

router.beforeEach(async (to, from) => {
  const guard = guards[to.name];
  if (guard) {
    return guard(to, from);
  }
});

export default router;
