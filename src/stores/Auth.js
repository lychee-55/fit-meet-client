// stores/Auth.js (Composition API - Setup Store)

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import router from '@/router';
import { useUserStore } from './User'; // User Store는 그대로 참조

export const useAuthStore = defineStore('auth', () => {
  // === STATE (상태) ===
  // 💡 1. Axios 인스턴스 생성 및 기본 설정 유지
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // 쿠키(ACCESS_TOKEN, REFRESH_TOKEN) 포함 요청
  });

  // const isRefreshing = ref(false);
  // let failedQueue = [];

  const userInfo = ref({
    nickname: '',
    profileImageUrl: '',
    email: '',
  });

  const isLoggedIn = ref(false);
  const loadingUser = ref(true); // 앱 로딩 시 사용자 정보 불러오는 중
  // 💡 Getter: 유저 정보가 로드되었는지 확인
  const isAuthenticated = computed(() => isLoggedIn.value);
  // 💡 Getter: 유저 닉네임을 쉽게 접근
  const userNickname = computed(() => userInfo.value.nickname);
  const authChecked = ref(false);
  // === 리프레시 헬퍼 함수 ===
  // const processQueue = (error, token = null) => {
  //   failedQueue.forEach(prom => {
  //     if (error) {
  //       prom.reject(error);
  //     } else {
  //       prom.resolve(token);
  //     }
  //   });
  //   failedQueue = [];
  // };
  // === ACTIONS (함수) ===

  // 💡 용도: 회원가입 (/api/auth/signup)
  async function createUser(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        payload,
      );
      return res.data;
    } catch (err) {
      if (err.response?.data) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // 💡 용도: 로그인 (/api/auth/login)
  async function getLogin(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        payload,
        { withCredentials: true },
      );

      if (res.data.code === 0) {
        isLoggedIn.value = true;
        // 로그인 후 사용자 정보 가져오기
        await fetchBasicUserInfo();
      }
      return res.data;
    } catch (err) {
      if (err.response) {
        return err.response?.data;
      } else {
        throw err.response?.data || err;
      }
    }
  }

  // 💡 용도: 이메일 중복 체크 (/api/auth/email-info)
  async function checkEmail(email) {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/email-info`, {
        params: { email },
      });
      return { available: true };
    } catch (err) {
      const msg = err.response?.data?.msg;
      return { available: false, message: msg };
    }
  }

  // 💡 용도: 사용자 로그인 기본 정보 조회 (닉네임/프로필 사진) (/api/user/profile-image)
  async function fetchBasicUserInfo() {
    if (isLoggedIn.value === false && loadingUser.value === false) {
      // 로그인 상태가 아닌데 굳이 복구 시도할 이유 없음
      return false;
    }
    loadingUser.value = true;

    try {
      // const res = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
      //   { withCredentials: true },
      // );
      const res = await api.get(`/api/user/profile-image`);
      console.log('사용자 정보 조회::', res);
      if (res.data.code === 0) {
        const userData = res.data.data;
        userInfo.value = {
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl,
          // email: userData.email, // 이 API에서 email이 안 온다면 주석 유지
        };
        isLoggedIn.value = true;
        return true;
      }
      return false;
    } catch (err) {
      console.log(err.response);
      // Access Token이 없거나 만료(401/1002)되면 인터셉터가 리프레시를 시도하며,
      // 리프레시까지 실패(1005)하면 이 요청은 최종적으로 실패(reject)됨.
      // 라우터 가드 로직을 위해 여기서 최종적으로 상태 초기화
      // console.error('fetchBasicUserInfo 최종 실패:', err.response?.data || err);
      // userInfo.value = {};
      // isLoggedIn.value = false;
      return false;
    } finally {
      authChecked.value = true;
      loadingUser.value = false;
    }
  }

  // 💡 2. 리프레시 함수: Access Token 재발급 및 사용자 정보 재조회 시도
  async function refreshAccessToken() {
    const res = await api.post('/api/auth/refresh');

    if (res.data.code !== 0) {
      throw new Error('Refresh Failed');
    }
  }

  // 💡 3. 인터셉터 설정 (아래에서 정의)
  // setupInterceptors(api, refreshAccessTokenAndUserInfo);

  // 💡 용도: 모든 유저 정보 조회 (Auth 및 User Store 업데이트) (/api/user/profile-info)
  async function fetchAllUserInfo() {
    loadingUser.value = true;
    const userStore = useUserStore(); // UserStore 참조

    try {
      // const res = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/api/user/profile-info`,
      //   { withCredentials: true },
      // );
      const res = await api.get(`/api/user/profile-info`);
      console.log('사용자 정보 조회::', res);

      if (res.data.code === 0) {
        const userData = res.data.data;

        // AuthStore 업데이트
        userInfo.value = {
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl,
          email: userData.email,
        };
        // UserStore에 신체 정보 저장
        userStore.setHealthInfoFromFetch(userData);
        isLoggedIn.value = true;
        return true;
      }
      return false;
      // else {
      //   console.error(
      //     'fetchAllUserInfo 실패: 서버 응답 코드 오류',
      //     res.data.msg,
      //   );
      //   userInfo.value = {};
      //   isLoggedIn.value = false;
      //   userStore.setHealthInfoFromFetch({});
      //   return false;
      // }
    } catch (err) {
      // console.error(
      //   'fetchAllUserInfo API 호출 실패:',
      //   err.response?.data || err,
      // );
      // userInfo.value = {};
      // isLoggedIn.value = false;
      // userStore.setHealthInfoFromFetch({});
      return false;
    } finally {
      loadingUser.value = false;
    }
  }

  // 💡 용도: 비밀번호 재설정 메일 전송 (/api/auth/password-reset/request)
  async function requestPasswordReset(email) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/password-reset/request`,
        { email: email },
        { withCredentials: true },
      );

      if (res.status === 200) {
        return {
          success: true,
          message:
            '비밀번호 재설정 메일이 발송되었습니다. 메일함을 확인해주세요.',
        };
      }
    } catch (err) {
      console.error('비밀번호 재설정 요청 중 오류 발생:', err);
      const errorMessage =
        err.response?.data?.msg || '네트워크 오류로 메일 발송에 실패했습니다.';

      throw {
        status: err.response?.status || 'Network Error',
        message: errorMessage,
      };
    }
  }

  // 💡 용도: 비밀번호 재설정 토큰 유효성 검사 (/api/auth/password-reset/validate)
  async function validatePasswordReset(token) {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/password-reset/validate`,
        { params: { token: token } },
      );
      return res;
    } catch (err) {
      return err.response.data;
    }
  }

  // 💡 용도: 비밀번호 재설정 완료 (/api/auth/password-reset/confirm)
  async function confirmPasswordReset(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/password-reset/confirm`,
        payload,
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      return err.response.data;
    }
  }

  // 💡 용도: 로그아웃 (/api/auth/logout)
  async function logout() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      resetAuthState();
      router.push({ name: 'login' });
      // if (res.data.code === 0) {
      //   userInfo.value = {};
      //   isLoggedIn.value = false;
      //   alert(res.data.msg);
      //   router.push({ name: 'login' });
      // }
    } catch (err) {
      console.log('로그아웃에 실패했습니다!');
    }
  }

  // 💡 용도: 회원탈퇴 (/api/user/signout)
  async function signout() {
    const userStore = useUserStore();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signout`,
        {},
        { withCredentials: true },
      );

      if (res.data.code === 0) {
        // userInfo.value = {};
        // isLoggedIn.value = false;
        userStore.setHealthInfoFromFetch({}); // User Store 초기화
        resetAuthState();
        alert(res.data.msg);
        router.push({ name: 'login' });
      }
    } catch (err) {
      console.log('회원탈퇴에 실패했습니다!');
    }
  }

  function resetAuthState() {
    userInfo.value = {};
    isLoggedIn.value = false;
  }

  setupInterceptors(api, resetAuthState);

  return {
    // State
    userInfo,
    isLoggedIn,
    loadingUser,

    // Getters
    isAuthenticated,
    userNickname,
    api,

    // Actions
    createUser,
    getLogin,
    checkEmail,
    fetchBasicUserInfo,
    fetchAllUserInfo,
    requestPasswordReset,
    validatePasswordReset,
    confirmPasswordReset,
    logout,
    signout,
    refreshAccessToken,
    resetAuthState,
    // refreshAccessTokenAndUserInfo,
  };
});
function setupInterceptors(apiInstance, resetAuthState) {
  apiInstance.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/api/auth/refresh') &&
        !originalRequest.url.includes('/api/auth/login') &&
        !originalRequest.url.includes('/api/auth/signup') &&
        !originalRequest.url.includes('/api/auth/password-reset')
      ) {
        originalRequest._retry = true;

        try {
          // 🔥 refresh 실행
          console.log('try');
          await apiInstance.post('/api/auth/refresh');

          // 🔁 원래 요청 재시도
          return apiInstance(originalRequest);
        } catch (refreshError) {
          resetAuthState();
          router.push({ name: 'login' });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}
// function setupInterceptors(apiInstance, resetAuthState) {
//   apiInstance.interceptors.response.use(
//     res => res,
//     async error => {
//       const originalRequest = error.config;
//       const errorCode = error.response?.data?.code;

//       // 🔥 Access Token 만료
//       if (
//         (error.response?.status === 403 || error.response?.status === 401) &&
//         // errorCode === 1002 &&
//         !originalRequest._retry
//       ) {
//         originalRequest._retry = true;

//         try {
//           await refreshAccessToken();

//           return apiInstance(originalRequest);
//         } catch (e) {
//           resetAuthState();
//           return Promise.reject(e);
//         }
//       }

//       // 🔥 Refresh Token 만료
//       if (errorCode === 1005) {
//         resetAuthState();
//       }

//       return Promise.reject(error);
//     },
//   );
// }
// 💡 4. 인터셉터 로직 분리 및 에러 코드 기반 처리
// function setupInterceptors(apiInstance, refreshCallback) {
//   apiInstance.interceptors.response.use(
//     response => response,
//     async error => {
//       const authStore = useAuthStore();
//       const originalRequest = error.config;
//       const errorCode = error.response?.data?.code; // 커스텀 에러 코드 추출

//       // Access Token 만료 코드(1002) & 재시도 아님 & 401 에러일 때
//       if (
//         error.response?.status === 401 &&
//         errorCode === 1002 &&
//         !originalRequest._isRetry
//       ) {
//         originalRequest._isRetry = true;

//         try {
//           // 리프레시 시도 (성공하면 새로운 Access Token 쿠키로 설정됨)
//           await refreshCallback();
//           // 원본 요청 재시도
//           return apiInstance(originalRequest);
//         } catch (refreshError) {
//           // 리프레시 실패 (Refresh Token 만료 등):
//           // 이 시점에서 authStore.isLoggedIn은 이미 false로 설정됨
//           return Promise.reject(error); // 최종 실패 에러 전파
//         }
//       }

//       // Refresh Token 만료 코드(1005) 등 다른 인증 오류 발생 시 (혹은 refreshCallback에서 에러 발생 시)
//       // 상태를 강제로 로그아웃 처리하고 에러 전파
//       if (errorCode === 1005) {
//         authStore.isLoggedIn = false;
//         authStore.userInfo = {};
//       }

//       return Promise.reject(error);
//     },
//   );
// }
