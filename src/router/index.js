// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// 페이지 컴포넌트 import
import LoginPage from "../pages/LoginPage.vue";
import SignupPage from "../pages/SignupPage.vue";
import UserInfoSettingPage from "../pages/UserInfoSettingPage.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    // meta: { hideHeader: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupPage,
  },
  {
    path: "/userProfile-detail",
    name: "UserProfileSetting",
    component: UserInfoSettingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
