<template>
  <div class="p-4 rounded-lg bg-white max-w-3xl mx-auto">
    <form @submit.prevent="submitAllUpdates" class="flex flex-col gap-10">
      <ProfileUserSection
        v-model:nickname="nickname"
        :is-edit-mode="isEditMode"
        :file-to-upload="fileToUpload"
        :current-preview-url="currentPreviewUrl"
        :current-profile-image="currentProfileImage"
        @file-change="handleFileChange"
        @delete-image="deleteImage"
        @upload-image="uploadProfileImage"
      />

      <ProfileBodySection v-model="formData" :is-edit-mode="isEditMode" />

      <p
        v-if="formMsg && formMsgStatus === 'error'"
        class="mt-3 text-base font-medium text-center text-red-600"
      >
        {{ formMsg }}
      </p>

      <div class="flex gap-4 mb-3">
        <button
          v-if="!isEditMode"
          type="button"
          @click="startEditMode"
          class="w-full py-4 mt-4 text-white text-base font-bold rounded-xl bg-[#8A8F6E] hover:bg-[#6e7256] transition shadow-lg"
        >
          편집하기
        </button>

        <template v-else>
          <button
            type="submit"
            :disabled="userStore.loading"
            class="flex-1 py-4 mt-4 text-white text-base font-bold rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow-lg disabled:bg-gray-400"
          >
            {{ userStore.loading ? '저장 중...' : '수정 완료' }}
          </button>
          <button
            type="button"
            @click="cancelEditMode"
            :disabled="userStore.loading"
            class="flex-1 py-4 mt-4 text-gray-700 text-base font-bold rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow-lg disabled:bg-gray-400"
          >
            취소
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { useUserStore } from '@/stores/User';
import defaultProfileImg from '@/assets/profile.png';
import ProfileBodySection from './ProfileBodySection.vue';
import ProfileUserSection from './ProfileUserSection.vue';

// 새로 분리된 자식 컴포넌트 임포트

const authStore = useAuthStore();
const userStore = useUserStore();

// ------------------ 로컬 상태 ------------------
const nickname = ref(authStore.userInfo?.nickname || '');
const formData = ref({ ...userStore.healthInfo });
const originalFormData = ref(null);
const isEditMode = ref(false);

// 프로필 사진 로직 상태 (메인에서 관리)
const fileToUpload = ref(null);
const currentPreviewUrl = ref(null);
const currentProfileImage = computed(
  () => authStore.userInfo?.profileImageUrl || defaultProfileImg,
);

// 폼 메시지
const formMsg = ref('');
const formMsgStatus = ref('');
// ... (formMsgStatusClass는 사용하지 않아 제거하거나 필요 시 추가)

// ------------------ 데이터 로딩 및 동기화 (메인에 유지) ------------------

const loadInitialData = async () => {
  if (!userStore.healthInfo.height_cm) {
    await authStore.fetchAllUserInfo();
  }
  nickname.value = authStore.userInfo?.nickname || '';
  formData.value = { ...userStore.healthInfo };
  originalFormData.value = { ...formData.value, nickname: nickname.value };
};

onMounted(async () => {
  await loadInitialData();
});

watch(
  () => userStore.healthInfo,
  newHealthInfo => {
    formData.value = { ...newHealthInfo };
    originalFormData.value = { ...formData.value, nickname: nickname.value };
  },
  { deep: true, immediate: true },
);

// ------------------ UI 모드 전환 및 취소 로직 (메인에 유지) ------------------

const startEditMode = () => {
  isEditMode.value = true;
  formMsg.value = '';
  // 현재 상태를 원본에 저장
  originalFormData.value = { ...formData.value, nickname: nickname.value };
};

const cancelEditMode = () => {
  if (originalFormData.value) {
    nickname.value = originalFormData.value.nickname;
    formData.value = { ...originalFormData.value };
  }
  isEditMode.value = false;
  //   formMsg.value = '수정 모드가 취소되었습니다.';
  //   formMsgStatus.value = 'error';
  // 이미지 관련 임시 상태도 초기화
  fileToUpload.value = null;
  currentPreviewUrl.value = null;
};

// ------------------ 프로필 사진 관련 로직 (메인에 유지) ------------------

const handleFileChange = event => {
  const file = event.target.files[0];
  if (file) {
    fileToUpload.value = file;
    currentPreviewUrl.value = URL.createObjectURL(file);
    formMsg.value =
      '사진이 선택되었습니다. "프로필 사진 저장" 버튼을 눌러주세요.';
    formMsgStatus.value = 'success';
  }
};

const deleteImage = async () => {
  fileToUpload.value = null;
  currentPreviewUrl.value = null;

  // 서버 삭제 로직
  if (
    authStore.userInfo?.profileImageUrl &&
    authStore.userInfo.profileImageUrl !== defaultProfileImg
  ) {
    try {
      await userStore.deleteUserProfileImg();
      formMsg.value = '프로필 이미지가 삭제되고 기본 이미지로 설정되었습니다.';
      formMsgStatus.value = 'success';
    } catch (error) {
      formMsg.value = '이미지 삭제에 실패했습니다.';
      formMsgStatus.value = 'error';
    }
  } else {
    formMsg.value = '프로필 사진이 초기화되었습니다.';
    formMsgStatus.value = 'success';
  }
};

const uploadProfileImage = async () => {
  formMsg.value = '';
  if (!fileToUpload.value) return;

  const formDataObj = new FormData();
  formDataObj.append('profileImage', fileToUpload.value);

  try {
    await userStore.updateUserProfileImg(formDataObj);
    fileToUpload.value = null;
    currentPreviewUrl.value = null;
    formMsg.value = '프로필 이미지가 성공적으로 변경되었습니다.';
    formMsgStatus.value = 'success';
  } catch (error) {
    formMsg.value = '이미지 업로드에 실패했습니다.';
    formMsgStatus.value = 'error';
  }
};

// ------------------ 최종 통합 수정 로직 (메인에 유지) ------------------

const submitAllUpdates = async () => {
  formMsg.value = '';

  if (!nickname.value.trim()) {
    formMsg.value = '닉네임을 입력해주세요.';
    formMsgStatus.value = 'error';
    return;
  }

  const requiredFields = [
    formData.value.height_cm,
    formData.value.weight_kg,
    formData.value.gender,
  ];
  if (requiredFields.some(v => v === null || v === '' || v === 0)) {
    formMsg.value = '키, 체중, 성별은 필수 입력 항목입니다.';
    formMsgStatus.value = 'error';
    return;
  }

  try {
    const payload = {
      nickname: nickname.value,
      heightCm: formData.value.height_cm,
      weightKg: formData.value.weight_kg,
      targetWeightKg: formData.value.target_weight_kg,
      gender: formData.value.gender,

      // birthDate 포맷팅 로직
      birthDate: formData.value.birth_date
        ? formData.value.birth_date instanceof Date
          ? formData.value.birth_date.toISOString().split('T')[0]
          : formData.value.birth_date
        : null,

      activityLevel: formData.value.activity_level || 'NONE',
    };

    await userStore.updateUserProfileInfo(payload);

    alert('프로필 및 신체 정보가 성공적으로 수정되었습니다.');

    // 수정 완료 후 원본 데이터 갱신 및 조회 모드로 복귀
    originalFormData.value = { ...formData.value, nickname: nickname.value };
    isEditMode.value = false;
  } catch (error) {
    console.error('통합 수정 실패:', error);
    formMsg.value = `수정에 실패했습니다. ${error.message || '서버 오류'}`;
    formMsgStatus.value = 'error';
  }
};
</script>
