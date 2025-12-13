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
    }, // 추가: 마이페이지에서만 필요한 로딩 상태 등
    loading: false,
  }),

  getters: {
    // 🚨 핵심: 신체 정보 미완료 상태를 명확히 정의
    isHealthInfoMissing: state => {
      // height_cm, weight_kg, gender 중 하나라도 null이거나 0이면 미완료로 간주
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
    // 🚨 1. 데이터 수신 액션 (AuthStore 전용)
    setHealthInfoFromFetch(userData) {
      this.healthInfo = {
        height_cm: userData.heightCm, // ⭐ 서버 응답 필드명(camelCase) 매핑
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
        // const requestBody = {
        //   nickname: newNickname,
        //   // healthInfo의 필드를 서버가 요구하는 카멜 케이스(camelCase)로 매핑하여 전송합니다.
        //   heightCm: this.healthInfo.height_cm,
        //   weightKg: this.healthInfo.weight_kg,
        //   targetWeightKg: this.healthInfo.target_weight_kg,
        //   gender: this.healthInfo.gender,
        //   // birthDate 필드는 Date 객체이거나 ISO 문자열이어야 합니다.
        //   birthDate: this.healthInfo.birth_date,
        //   activityLevel: this.healthInfo.activity_level,
        // };

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
          // 서버 응답 코드가 0이 아닐 경우 실패로 간주
          throw new Error(res.data.msg || '프로필 수정에 실패했습니다.');
        }
      } catch (err) {
        console.error('프로필 수정 실패:', err);
        // Vue 컴포넌트에서 catch 블록으로 처리할 수 있도록 에러를 다시 던집니다.
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
          formData, // Multipart/form-data 전송
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );

        if (res.data.code === 0) {
          const newImageUrl = res.data.data; // 서버에서 받은 새로운 URL
          // AuthStore의 userInfo 업데이트
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
        // DELETE 요청은 body를 포함하지 않음. URL만으로 요청
        const res = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
          { withCredentials: true },
        );

        if (res.data.code === 0) {
          // AuthStore의 userInfo 업데이트 (기본 이미지 URL로 설정 필요)
          // *프로젝트의 기본 이미지 URL로 변경 필요*
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

    async submitBodyProfileInfo() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/insert-body`,
          this.healthInfo,
          {
            withCredentials: true,
          },
        );

        // 서버 응답이 200 OK이고, 내부적으로 성공 코드(예: code === 0)를 반환할 때
        if (res.data && res.data.code === 0) {
          // 성공 메시지 반환
          return '등록에 성공하셨습니다! 환영합니다!';
        } else {
          // 200 OK를 받았지만 서버 로직상 실패한 경우 (예외 처리)
          throw new Error(
            res.data.msg || '정보 등록에 실패했습니다. (서버 내부 오류)',
          );
        }
      } catch (err) {
        console.error('프로필 전송 실패:', err);

        // 403, 네트워크 오류 등 모든 에러를 포괄하여 단순화된 메시지로 던짐
        if (err.response && err.response.status === 403) {
          throw new Error(
            '정보 등록 권한이 부족하거나 유효성 검사에 실패했습니다.',
          );
        }

        // 기타 네트워크 또는 서버 오류
        throw new Error('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  },
});
