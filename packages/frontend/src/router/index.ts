import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordName } from 'vue-router';

import GameView from '@/views/GameView.vue';
import HomeView from '@/views/HomeView.vue';
import LogInOtpView from '@/views/LogInOtpView.vue';
import LogInView from '@/views/LogInView.vue';
import NuxView from '@/views/NuxView.vue';
import SignUpOtpView from '@/views/SignUpOtpView.vue';
import SignUpView from '@/views/SignUpView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'nux',
      component: NuxView,
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView,
    },
    {
      path: '/login/otp',
      name: 'login_otp',
      component: LogInOtpView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/signup/otp',
      name: 'signup_otp',
      component: SignUpOtpView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/start',
      name: 'start',
      component: GameView,
    },
    {
      path: '/game/:gameId',
      name: 'game',
      component: GameView,
    },
  ],
});

interface RouteGuards {
  [key: RouteRecordName]: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => void | string;
}

function disallowAuthGuard() {
  const authToken = localStorage.getItem('authorization');
  if (authToken) {
    return '/home';
  }
}

function requireAuthGuard() {
  const authToken = localStorage.getItem('authorization');
  if (!authToken) {
    return '/';
  }
}

const guards: RouteGuards = {
  nux: disallowAuthGuard,
  login: disallowAuthGuard,
  login_otp: disallowAuthGuard,
  signup: disallowAuthGuard,
  signup_otp: disallowAuthGuard,
  home: requireAuthGuard,
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
