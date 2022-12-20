import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordName } from 'vue-router';

import HostView from '@/views/HostView.vue';
import LogInView from '@/views/LogInView.vue';
import NuxView from '@/views/NuxView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NuxView,
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView,
    },
    {
      path: '/start',
      name: 'start',
      component: HostView,
    },
    {
      path: '/game/:gameId',
      name: 'game',
      component: HostView,
    },
  ],
});

interface RouteGuards {
  [key: RouteRecordName]: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => void | string;
}

const guards: RouteGuards = {
  /*
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
  */
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
