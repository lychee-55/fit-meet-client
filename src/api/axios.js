import axios from 'axios';
import { useAuthStore } from '@/stores/Auth';
import router from '@/router';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh') &&
      !originalRequest.url.includes('/api/auth/login') &&
      !originalRequest.url.includes('/api/auth/signup') &&
      !originalRequest.url.includes('/api/auth/password-reset')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('액세스 만료 감지: 리프레시 시도 중...');
        // console.log("originalrequest", originalRequest.url);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // await authStore.fetchBasicUserInfo();

        console.log('리프레시 및 유저 정보 복구 성공');

        processQueue(null);
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.resetAuthState();

        if (!window.isAlerting) {
          window.isAlerting = true;
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.replace('/auth/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default apiInstance;
