// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 페이지 컴포넌트 import
import LoginPage from '@/pages/LoginPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

import { useAuthStore } from '@/stores/Auth';
import HomePage from '@/pages/HomePage.vue';
import PasswordResetPage from '@/pages/PasswordResetPage.vue';
import UserMyPage from '@/pages/UserMyPage.vue';
import NotFound from '@/components/common/NotFound.vue';
import DashBoardPage from '@/pages/DashBoardPage.vue';
import DietPage from '@/pages/DietPage.vue';
import UserHealthInfoPage from '@/pages/unused/UserHealthInfoPage.vue';
import CreateDietFormPage from '@/pages/CreateDietFormPage.vue';

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
  // {
  //   path: '/userProfile-detail',
  //   name: 'UserProfileSetting',
  //   component: UserInfoSettingPage,
  // },
  // {
  //   path: '/user/profile-info',
  //   name: 'userHealthInfo',
  //   component: UserHealthInfoPage,
  // },
  {
    path: '/my-page',
    name: 'myPage',
    component: UserMyPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashBoard',
    name: 'dashBoard',
    component: DashBoardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/diet',
    name: 'DietManagement',
    component: DietPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/diet/create-diet/:method',
    name: 'createDiet',
    component: CreateDietFormPage,
    meta: { requiresAuth: true },
  },
  {
    // Vue Router 4에서는 '/:pathMatch(.*)*' 패턴이 권장됩니다.
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const whiteList = ['login', 'signup', 'passwordReset'];

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();
  // 1️⃣ 인증 필요 없는 페이지
  if (!to.meta.requiresAuth) {
    // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시
    if (store.isLoggedIn && whiteList.includes(to.name)) {
      return next({ name: 'dashBoard' });
    }
    return next();
  }

  // 2️⃣ 이미 로그인 상태
  if (store.isLoggedIn) {
    return next();
  }
  // if (!store.authChecked) {
  //   await store.fetchBasicUserInfo();
  // }
  // next();

  // 3️⃣ 새로고침 직후 (상태 복구)
  if (store.loadingUser) {
    const ok = await store.fetchBasicUserInfo();
    if (ok) return next();
  }

  // 4️⃣ 인증 실패
  alert('로그인이 필요하거나 세션이 만료되었습니다.');
  return next({ name: 'login' });

  // // 1. 화이트 리스트 경로는 무조건 통과
  // if (whiteList.includes(to.name)) {
  //   // 이미 로그인 상태인데 로그인/회원가입 페이지로 접근 시 대시보드로 리다이렉트
  //   if (store.isLoggedIn) {
  //     return next({ name: 'dashBoard' });
  //   }
  //   return next();
  // }

  // if (store.loadingUser) {
  // }

  // // 2. 현재 로그인 상태 확인
  // if (store.isLoggedIn) {
  //   return next();
  // } else {
  //   // 💡 최종 로그인 여부 재확인
  //   const ok = await store.fetchBasicUserInfo();

  //   if (ok) {
  //     return next();
  //   } else {
  //     alert('로그인이 필요하거나 만료되었습니다. 다시 로그인 해주세요.');
  //     return next({ name: 'login' });
  //   }
  // }
});

export default router;
