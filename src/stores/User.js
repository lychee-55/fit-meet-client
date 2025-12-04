// /src/store/User.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false,
  }),

  actions: {
    // 회원가입
    async createUser(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`,
          payload,
        );
        return res.data;
      } catch (err) {
        if (err.response) {
          return err.response?.data;
        } else {
          throw err.response?.data || err;
        }
      }
    },

    // 로그인
    async getLogin(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          payload,
        );

        if (res.data.code === 0) {
          this.isLoggedIn = true;
          this.userInfo = res.data.data;
        }

        return res.data;
      } catch (err) {
        if (err.response) {
          return err.response?.data;
        } else {
          throw err.response?.data || err;
        }
      }
    },

    // 이메일 중복 체크
    async checkEmail(email) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/email-info`,
          { params: { email } },
        );
        return { available: true };
      } catch (err) {
        const msg = err.response?.data?.msg;
        return { available: false, message: msg };
      }
    },
  },
});
