import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordName, RouteLocationNormalized } from 'vue-router';

import HomeView from '../views/HomeView.vue';
// import LoginView from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    /*
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
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
    },
    */
  ],
});

interface RouteGuards {
  [key: RouteRecordName]: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => void | string;
}

const guards: RouteGuards = {
  join(to) {
    const authToken = localStorage.getItem('authorization');
    if (!authToken) {
      return `/login?to=${to.path}`;
    }
  },

  login() {
    const authToken = localStorage.getItem('authorization');
    if (authToken) {
      return `/`;
    }
  },
};

router.beforeEach(async (to, from) => {
  if (to.name) {
    const guard = guards[to.name];
    if (guard) {
      return guard(to, from);
    }
  }
});

export default router;
