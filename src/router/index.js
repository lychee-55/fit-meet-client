import { createRouter, createWebHistory } from 'vue-router';

// 페이지 컴포넌트 import
import LoginPage from '@/pages/LoginPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

import { useAuthStore } from '@/stores/Auth';
// import HomePage from "@/pages/HomePage.vue";
import PasswordResetPage from '@/pages/PasswordResetPage.vue';
import UserMyPage from '@/pages/UserMyPage.vue';
import NotFound from '@/components/common/NotFound.vue';
import DashBoardPage from '@/pages/DashBoardPage.vue';
import DietPage from '@/pages/DietPage.vue';
// import UserHealthInfoPage from "@/pages/unused/UserHealthInfoPage.vue";
import CreateDietFormPage from '@/pages/CreateDietFormPage.vue';
// import HandleSubmitDietForm from "@/components/diet/formElements/HandleSubmitDietForm.vue";
import CommunityPage from '@/pages/CommunityPage.vue';
import TrainingVideoPage from '@/pages/TrainingVideoPage.vue';
import CommunityMyPage from '@/pages/CommunityMyPage.vue';
import CreatePostPage from '@/pages/CreatePostPage.vue';
import CommunityFeedPage from '@/pages/CommunityFeedPage.vue';
import TrainingVideosView from '@/components/training/TrainingVideosView.vue';
import VideoDetailView from '@/components/training/VideoDetailView.vue';
import PostItemDetailModal from '@/components/community/PostItemDetailModal.vue';

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
    props: true,
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
        component: CommunityFeedPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'post/:id', // /community/post/123 접근 시 (alias 대신 직접 경로 설정)
        name: 'communityPostDetail',
        component: CommunityFeedPage, // 동일한 컴포넌트를 사용하여 리스트 위에 모달을 띄움
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
        props: true,
      },
    ],
  },
  {
    path: '/training',
    name: 'training',
    component: TrainingVideoPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'videos',
        component: TrainingVideosView,
        meta: { requiresAuth: true },
      },
      {
        path: 'videos/:id',
        name: 'videoDetail',
        component: VideoDetailView,
        meta: { requiresAuth: true },
      },
    ],
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

  // 이미 로그인한 사용자가 화이트리스트(로그인, 회원가입 등) 접근 시 대시보드로 리다이렉트
  if (whiteList.includes(to.name)) {
    if (store.isLoggedIn) {
      return next({ name: 'dashBoard' });
    }
    // 로그인 안 된 상태면 그냥 통과 (여기서 fetchBasicUserInfo를 호출하면 안 됨)
    return next();
  }

  // if (!store.authChecked) {
  //   try {
  //     await store.fetchBasicUserInfo();
  //   } catch (err) {
  //     // 실패해도 catch해서 다음 로직(로그인 페이지 이동)으로 넘겨야 함
  //     console.warn("인증 확인 실패");
  //   }
  // }

  // 인증 필요 없는 페이지 접근 시 정보가 없다면 1회 시도
  if (!store.isLoggedIn && !store.authChecked) {
    try {
      await store.fetchBasicUserInfo();
    } catch (err) {
      // 실패 시 가만히 둠 (아래에서 로그인 체크에 걸림)
    }
  }

  // 최종 로그인 여부 확인
  if (store.isLoggedIn) {
    return next();
  } else {
    // 인증 필수 페이지라면 로그인으로
    if (to.meta.requiresAuth !== false) {
      // alert은 인터셉터에서 띄우므로 여기서는 생략하거나 하나만 남겨야 함
      return next({ name: 'login' });
    }
    return next();
  }
});

export default router;
