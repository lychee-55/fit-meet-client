import { defineStore } from 'pinia';
import { useAuthStore } from './Auth';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    healthInfo: {
      height_cm: null,
      weight_kg: null,
      target_weight_kg: null,
      gender: null,
      birth_date: null,
      activity_level: null,
    },
    loading: false,
  }),

  getters: {
    // 신체 정보 미완료 상태를 명확히 정의
    isHealthInfoMissing: state => {
      const requiredFields = [
        state.healthInfo.height_cm,
        state.healthInfo.weight_kg,
        state.healthInfo.gender,
      ];

      // 필수 필드 중 하나라도 값이 없거나 0이면 true 반환
      return requiredFields.some(value => value === null || value === 0);
    },
  },

  actions: {
    setHealthInfoFromFetch(userData) {
      this.healthInfo = {
        height_cm: userData.heightCm,
        weight_kg: userData.weightKg,
        target_weight_kg: userData.targetWeightKg,
        gender: userData.gender,
        birth_date: userData.birthDate,
        activity_level: userData.activityLevel,
      };
    },

    //프로필 수정
    async updateUserProfileInfo(payload) {
      this.loading = true;
      const authStore = useAuthStore();

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/profile-upt`,
          payload,
          { withCredentials: true },
        );
        console.log('프로필 수정  ::', res.data);
        if (res.data.code === 0) {
          // AuthStore의 userInfo 업데이트
          authStore.userInfo.nickname = payload.nickname;
          this.setHealthInfoFromFetch(payload);
          return res.data;
        } else {
          throw new Error(res.data.msg || '프로필 수정에 실패했습니다.');
        }
      } catch (err) {
        console.error('프로필 수정 실패:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    //프로필 이미지 수정
    async updateUserProfileImg(formData) {
      this.loading = true;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
          formData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );

        if (res.data.code === 0) {
          const newImageUrl = res.data.data;
          const authStore = useAuthStore();
          authStore.userInfo.profileImageUrl = newImageUrl;
          return newImageUrl;
        } else {
          throw new Error(res.data.msg || '이미지 업로드에 실패했습니다.');
        }
      } catch (err) {
        console.error('프로필 이미지 수정 실패:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    //프로필 이미지 삭제
    async deleteUserProfileImg() {
      this.loading = true;
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
          { withCredentials: true },
        );

        if (res.data.code === 0) {
          const authStore = useAuthStore();
          authStore.userInfo.profileImageUrl = '';
          return res.data;
        } else {
          throw new Error(res.data.msg || '이미지 삭제에 실패했습니다.');
        }
      } catch (err) {
        console.error('프로필 이미지 삭제 실패:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updatePassword(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/password-upt`,
          payload,
          {
            withCredentials: true,
          },
        );

        return res.data;
      } catch (err) {
        return err.response.data;
      }
    },

    // 첫 신체정보 입력 (지금은 폐기함)
    async submitBodyProfileInfo() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/insert-body`,
          this.healthInfo,
          {
            withCredentials: true,
          },
        );

        if (res.data && res.data.code === 0) {
          return '등록에 성공하셨습니다! 환영합니다!';
        } else {
          throw new Error(
            res.data.msg || '정보 등록에 실패했습니다. (서버 내부 오류)',
          );
        }
      } catch (err) {
        console.error('프로필 전송 실패:', err);

        if (err.response && err.response.status === 403) {
          throw new Error(
            '정보 등록 권한이 부족하거나 유효성 검사에 실패했습니다.',
          );
        }

        throw new Error('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  },
});
