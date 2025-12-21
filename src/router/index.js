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
import HandleSubmitDietForm from '@/components/diet/formElements/HandleSubmitDietForm.vue';
import CommunityPage from '@/pages/CommunityPage.vue';
import TrainingVideoPage from '@/pages/TrainingVideoPage.vue';
import CommunityMyPage from '@/pages/CommunityMyPage.vue';
import CreatePostPage from '@/pages/CreatePostPage.vue';
import CommunityFeedPage from '@/pages/CommunityFeedPage.vue';

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomePage,
  // },
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
    path: '/diet/form/:method/:id?',
    name: 'dietForm',
    component: CreateDietFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'communityFeed',
        component: CommunityFeedPage, // 게시글 전체조회 컴포넌트
        meta: { requiresAuth: true },
      },
      {
        path: 'my-page',
        name: 'communityMypage',
        component: CommunityMyPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'form/:method/:id?',
        name: 'postForm',
        component: CreatePostPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/training',
    name: 'training',
    component: TrainingVideoPage,
    meta: { requiresAuth: true },
  },
  {
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

  if (!store.authChecked) {
    await store.fetchBasicUserInfo();
  }

  // 인증 필요 없는 페이지 확인용
  if (!store.isLoggedIn && !store.authChecked) {
    await store.fetchBasicUserInfo();
  }

  // 2. 이미 로그인한 사용자가 화이트리스트(로그인, 회원가입 등) 접근 시 대시보드로 리다이렉트
  if (whiteList.includes(to.name) && store.isLoggedIn) {
    return next({ name: 'dashBoard' });
  }

  // 3. 인증이 필요 없는 페이지(로그인, 회원가입 등)는 그냥 통과
  if (to.meta.requiresAuth === false || whiteList.includes(to.name)) {
    return next();
  }

  // 로그인 상태면
  if (store.isLoggedIn) {
    return next();
  }

  // 새로고침 직후 (상태 복구)
  if (store.loadingUser) {
    const ok = await store.fetchBasicUserInfo();
    if (ok) return next();
  }

  // 4. 인증이 필요한 페이지인데 로그인 안 되어 있으면
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    alert('로그인이 필요하거나 세션이 만료되었습니다.');
    return next({ name: 'login' });
  }

  alert('로그인이 필요하거나 세션이 만료되었습니다.');
  return next({ name: 'login' });
});

export default router;
