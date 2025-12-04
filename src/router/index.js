// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 페이지 컴포넌트 import
import LoginPage from '@/pages/LoginPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import UserInfoSettingPage from '@/pages/UserInfoSettingPage.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const routes = [
  {
    path: '/',
    name: 'home',
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
    ],
  },
  {
    path: '/userProfile-detail',
    name: 'UserProfileSetting',
    component: UserInfoSettingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
