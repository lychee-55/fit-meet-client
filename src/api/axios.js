import axios from "axios";
import { useAuthStore } from "@/stores/Auth";
import router from "@/router";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 순수한 axios 인스턴스 생성
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    // 에러 응답이 없거나 이미 리트라이한 요청이면 즉시 거절
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/refresh") &&
      !originalRequest.url.includes("/api/auth/login") &&
      !originalRequest.url.includes("/api/auth/signup") &&
      !originalRequest.url.includes("/api/auth/password-reset")
    ) {
      if (isRefreshing) {
        // 리프레시 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refresh 실행
        console.log("액세스 만료 감지: 리프레시 시도 중...");
        console.log("originalrequest", originalRequest.url);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // await authStore.fetchBasicUserInfo();

        console.log("리프레시 및 유저 정보 복구 성공");

        processQueue(null); // 대기 중인 요청들 진행
        // 원래 요청 재시도
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.resetAuthState();

        if (!window.isAlerting) {
          window.isAlerting = true;
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          // window.location.href = "/auth/login";
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
