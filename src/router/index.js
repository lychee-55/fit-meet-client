// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 페이지 컴포넌트 import
import LoginPage from '@/pages/LoginPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import UserInfoSettingPage from '@/pages/UserInfoSettingPage.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import UserHealthInfoPage from '@/pages/UserHealthInfoPage.vue';

import { useAuthStore } from '@/stores/Auth';
import HomePage from '@/pages/HomePage.vue';
import PasswordResetPage from '@/pages/PasswordResetPage.vue';
import UserMyPage from '@/pages/UserMyPage.vue';
// import DashBoardPage from '@/pages/DashBoardPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
      },
      {
        path: 'signup',
        name: 'signup',
        component: SignupPage,
      },
      {
        path: 'password-reset',
        name: 'passwordReset',
        component: PasswordResetPage,
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/userProfile-detail',
    name: 'UserProfileSetting',
    component: UserInfoSettingPage,
  },
  {
    path: '/user/profile-info',
    name: 'userHealthInfo',
    component: UserHealthInfoPage,
  },
  {
    path: '/my-page',
    name: 'myPage',
    component: UserMyPage,
  },
  // {
  //   path: '/dashBoard',
  //   name: 'dashBoard',
  //   component: DashBoardPage,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const whiteList = ['login', 'signup', 'passwordReset'];
// const whitePathList = ['/auth/login', '/auth/signup', '/auth/password-reset'];

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();

  // name 기준 or path 기준 둘 다 허용
  if (whiteList.includes(to.name)) {
    return next();
  }

  // 로그인 여부 확인
  const ok = await store.fetchBasicUserInfo();

  if (ok) {
    return next();
  } else {
    alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
    return next({ name: 'login' });
  }
});

export default router;
