import { defineStore } from "pinia";
import { ref, computed, markRaw } from "vue";
import axios from "axios";
import router from "@/router";
import { useUserStore } from "./User";
import apiInstance from "@/api/axios";
import { useTrainingStore } from "./Training";

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref({
    nickname: "",
    profileImageUrl: "",
    email: "",
    bodyInfoVal: false,
  });

  const trainingStore = useTrainingStore();

  const isLoggedIn = ref(false);
  const loadingUser = ref(true);

  // Getter
  // 유저 정보가 로드 확인
  const isAuthenticated = computed(() => isLoggedIn.value);
  // 유저 닉네임에 접근
  const userNickname = computed(() => userInfo.value.nickname);
  const authChecked = ref(false);

  // Action
  // 회원가입 (/api/auth/signup)
  async function createUser(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        payload
      );
      return res.data;
    } catch (err) {
      if (err.response?.data) {
        throw err.response.data;
      }
      throw err;
    }
  }

  // 로그인 (/api/auth/login)
  async function getLogin(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        payload,
        { withCredentials: true }
      );

      if (res.data.code === 0) {
        isLoggedIn.value = true;
        await fetchBasicUserInfo();
        await trainingStore.fetchYoutubeAdminSync(); //app.vue에서 안불러와져서 여기에 작성함.
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

  // 이메일 중복 체크 (/api/auth/email-info)
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

  // 사용자 로그인 기본 정보 조회 (닉네임/프로필 사진/신체정보 기입 상태) (/api/user/profile-image)
  async function fetchBasicUserInfo() {
    if (isLoggedIn.value === false && loadingUser.value === false) {
      return false;
    }
    loadingUser.value = true;

    try {
      const res = await apiInstance.get(`/api/user/profile-image`);
      console.log("사용자 정보 조회::", res);
      if (res.data.code === 0) {
        const userData = res.data.data;
        userInfo.value = {
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl,
          bodyInfoVal: Boolean(userData.bodyInfoVal),
          // email: userData.email,
        };
        isLoggedIn.value = true;
        return true;
      }
      return false;
    } catch (err) {
      console.log(err.response);
      // return false;
      throw err;
    } finally {
      authChecked.value = true;
      loadingUser.value = false;
    }
  }

  // Access Token 재발급 및 사용자 정보 재조회 시도(리프레시 토큰)('/api/auth/refresh')
  async function refreshAccessToken() {
    const res = await apiInstance.post("/api/auth/refresh");

    if (res.data.code !== 0) {
      throw new Error("Refresh Failed");
    }
  }

  // 모든 유저 정보 조회 (Auth 및 User Store 업데이트) (/api/user/profile-info)
  async function fetchAllUserInfo() {
    loadingUser.value = true;
    const userStore = useUserStore();
    try {
      const res = await apiInstance.get(`/api/user/profile-info`);
      console.log("사용자 정보 조회::", res);

      if (res.data.code === 0) {
        const userData = res.data.data;

        // AuthStore 업데이트
        userInfo.value = {
          nickname: userData.nickname,
          profileImageUrl: userData.profileImageUrl,
          email: userData.email,
          bodyInfoVal: userData.bodyInfoVal,
        };
        console.log("fetchbodyinfo:", userData.bodyInfoVal, bodyInfoVal);
        // UserStore에 신체 정보 저장
        userStore.setHealthInfoFromFetch(userData);
        isLoggedIn.value = true;
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      loadingUser.value = false;
    }
  }

  // 비밀번호 재설정 메일 전송 (/api/auth/password-reset/request)
  async function requestPasswordReset(email) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/password-reset/request`,
        { email: email },
        { withCredentials: true }
      );

      if (res.status === 200) {
        return {
          success: true,
          message:
            "비밀번호 재설정 메일이 발송되었습니다. 메일함을 확인해주세요.",
        };
      }
    } catch (err) {
      console.error("비밀번호 재설정 요청 중 오류 발생:", err);
      const errorMessage =
        err.response?.data?.msg || "네트워크 오류로 메일 발송에 실패했습니다.";

      throw {
        status: err.response?.status || "Network Error",
        message: errorMessage,
      };
    }
  }

  // 비밀번호 재설정 토큰 유효성 검사 (/api/auth/password-reset/validate)
  async function validatePasswordReset(token) {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/password-reset/validate`,
        { params: { token: token } }
      );
      return res;
    } catch (err) {
      return err.response.data;
    }
  }

  // 비밀번호 재설정 완료 (/api/auth/password-reset/confirm)
  async function confirmPasswordReset(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/password-reset/confirm`,
        payload,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return err.response.data;
    }
  }

  // 로그아웃 (/api/auth/logout)
  async function logout() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      resetAuthState();
      router.push({ name: "login" });
    } catch (err) {
      console.log("로그아웃에 실패했습니다!");
    }
  }

  // 회원탈퇴 (/api/user/signout)
  async function signout() {
    const userStore = useUserStore();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signout`,
        {},
        { withCredentials: true }
      );

      if (res.data.code === 0) {
        userStore.setHealthInfoFromFetch({});
        resetAuthState();
        alert(res.data.msg);
        router.push({ name: "login" });
      }
    } catch (err) {
      console.log("회원탈퇴에 실패했습니다!");
    }
  }

  function resetAuthState() {
    userInfo.value = {};
    isLoggedIn.value = false;
  }

  return {
    // State
    userInfo,
    isLoggedIn,
    loadingUser,

    // Getters
    isAuthenticated,
    userNickname,
    // apiInstance,

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
  };
});
