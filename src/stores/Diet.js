import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
// import axios from 'axios';
import { useAuthStore } from './Auth';
// const BASE_URL = `${import.meta.env.VITE_API_URL}/api/diets`;
import apiInstance from '@/api/axios';

export const useDietStore = defineStore('diet', () => {
  //  state
  const dietList = ref([]);
  const dailyDietMap = ref({});
  const isLoading = ref(false);
  const error = ref(null);

  // getter
  const getDietByDate = dateString => {
    return dailyDietMap.value[dateString] || [];
  };

  // ACTIONS (함수)
  // 식단 등록 (POST /api/diets)
  async function insertDiet(dietData) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiInstance.post(`/api/diets`, dietData);

      if (response.data.code === 0) {
        console.log('식단 등록 성공');
      }

      return response.data;
    } catch (err) {
      error.value = '식단 등록에 실패했습니다.';
      console.error('스토어: 식단 등록 실패', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // 특정 날짜의 식단 정보를 서버에서 가져와 dailyDietMap에 저장
  async function fetchDietForDay(dateString) {
    // 캐싱: 이미 데이터가 있으면 요청 안함 (필요시 주석 해제)
    // if (dailyDietMap.value[dateString]) return;

    isLoading.value = true;
    try {
      const response = await apiInstance.get(
        `/api/diets/day?date=${dateString}`,
      );

      // 새로운 객체 레퍼런스를 할당하여 반응성을 강제로 트리거
      dailyDietMap.value = {
        ...dailyDietMap.value,
        [dateString]: response.data.data || [],
      };

      console.log(
        'Store 저장 완료:',
        dateString,
        dailyDietMap.value[dateString],
      );
    } catch (err) {
      console.error('스토어 조회 실패', err);
      dailyDietMap.value[dateString] = [];
    } finally {
      isLoading.value = false;
    }
  }

  //특정 식단의 상세 정보(음식 리스트 포함) 조회
  async function fetchDietDetail(dietId) {
    if (!dietId) return null;
    isLoading.value = true;
    try {
      const response = await apiInstance.get(`/api/diets/${dietId}`);
      return response.data.data;
    } catch (err) {
      console.error('식단 상세 조회 실패:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 기간별 식단 조회 (캘린더용 점 표시용)
   * startDate ~ endDate 범위의 데이터를 한 번에 가져와서 dailyDietMap에 분배
   */
  async function fetchMonthDiets(startDate, endDate) {
    isLoading.value = true;
    try {
      const response = await apiInstance.get(
        `/api/diets/calendar?startDate=${startDate}&endDate=${endDate}`,
      );

      const data = response.data.data || [];

      // 데이터를 날짜별로 그룹화
      const grouped = data.reduce((acc, diet) => {
        const dateKey = diet.date.split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(diet);
        return acc;
      }, {});

      // 기존 데이터와 합치기
      dailyDietMap.value = {
        ...dailyDietMap.value,
        ...grouped,
      };

      console.log('월간 데이터 로드 완료:', grouped);
    } catch (err) {
      console.error('월간 데이터 조회 실패:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // 사용자 섭취용량 재설정시 영양성분 재패치
  async function fetchDietNutrition(foodDataArray) {
    if (!foodDataArray || foodDataArray.length === 0) {
      console.error('스토어: 전송할 음식 데이터 배열이 비어있습니다.');
      return null;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiInstance.post(`/api/diets/nutrition`, {
        foods: foodDataArray,
      });

      if (response.data.code !== 0 || !response.data.data) {
        alert('영양성분 정보를 재조회하는 데 실패했습니다.');
        return null;
      }

      return response.data.data;
    } catch (err) {
      error.value = '음식 영양성분 재조회에 실패했습니다.';
      console.error('스토어: 음식 영양성분 재조회 실패', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  //식단 수정 (PUT /api/diets/{dietId})
  async function updateDiet(dietId, updateData) {
    isLoading.value = true;
    try {
      const response = await apiInstance.put(`/api/diets/${dietId}`);

      // 수정 성공 시 dailyDietMap 동기화 로직
      const dateKey = updateData.date.split('T')[0];
      if (dailyDietMap.value[dateKey]) {
        await fetchDietForDay(dateKey);
      }

      return response.data;
    } catch (err) {
      console.error('스토어: 식단 수정 실패', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  //식단 삭제 (DELETE /api/diets/{dietId})
  async function deleteDiet(dietId, dateString) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiInstance.delete(`/api/diets/${dietId}`);

      if (response.data.code === 0) {
        // dailyDietMap에서 해당 식단 제거(store 반영)
        if (dailyDietMap.value[dateString]) {
          dailyDietMap.value[dateString] = dailyDietMap.value[
            dateString
          ].filter(d => (d.id || d.dietId) !== dietId);

          // 만약 해당 날짜에 식단이 하나도 안 남았다면 키 자체를 정리
          if (dailyDietMap.value[dateString].length === 0) {
            delete dailyDietMap.value[dateString];
          }

          // 반응성 트리거를 위한 재할당
          dailyDietMap.value = { ...dailyDietMap.value };
        }
        console.log(`식단 ${dietId} 삭제 성공`);
      }
      return response.data;
    } catch (err) {
      error.value = '식단 삭제에 실패했습니다.';
      console.error('스토어: 식단 삭제 실패', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  // S3 업로드를 위한 URL 발급
  async function getPresignedUrl(filename) {
    isLoading.value = true;
    error.value = null; // 이전 에러 초기화

    try {
      const response = await apiInstance.get(`/api/diet/images/presign`, {
        params: { filename },
        // withCredentials: true,
      });

      // 백엔드 응답 구조에 따라 response.data.data가 될 수도 있으니 확인 필요
      return response.data;
    } catch (err) {
      error.value = '이미지 업로드 권한을 가져오지 못했습니다.';
      console.error('스토어: Presigned URL 발급 실패', err);

      // 인터셉터가 401/403을 처리하겠지만,
      // 여기서도 reject를 던져서 컴포넌트가 업로드 프로세스를 중단하게 합니다.
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // GPT Vision 분석 요청
  async function analyzeImage(imageUrl) {
    isLoading.value = true;
    try {
      const response = await apiInstance.post(
        `/api/diet/images/analyze`,
        null,
        {
          params: { imageUrl },
          // withCredentials: true,
        },
      );
      return response.data; // 분석 결과 아이템 리스트
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    dietList,
    dailyDietMap,
    isLoading,
    error,

    // Getters
    getDietByDate,

    // Actions
    insertDiet,
    fetchDietForDay,
    fetchDietDetail,
    fetchMonthDiets,
    fetchDietNutrition,
    updateDiet,
    deleteDiet,
    getPresignedUrl,
    analyzeImage,
  };
});
