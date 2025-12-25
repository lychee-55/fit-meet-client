<template>
  <div class="p-4 rounded-lg bg-white max-w-3xl mx-auto">
    <form @submit.prevent="submitAllUpdates" class="flex flex-col gap-10">
      <ProfileUserSection
        v-model:nickname="nickname"
        :is-edit-mode="isEditMode"
        :file-to-upload="fileToUpload"
        :current-preview-url="currentPreviewUrl"
        :current-profile-image="currentProfileImage"
        :fallback-image="profileImg"
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
          class="w-full py-2 mt-4 text-white text-base font-bold rounded-xl bg-[#8A8F6E] hover:bg-[#6e7256] transition shadow-lg"
        >
          편집하기
        </button>

        <template v-else>
          <button
            type="submit"
            :disabled="userStore.loading"
            class="flex-1 py-4 mt-4 text-white text-base font-bold rounded-xl orange-bg-color hover:orange-bg-color transition shadow-lg disabled:bg-gray-400"
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
import defaultProfileImg from '@/assets/profile.jpg';
import ProfileBodySection from './ProfileBodySection.vue';
import ProfileUserSection from './ProfileUserSection.vue';

const authStore = useAuthStore();
const userStore = useUserStore();

// ------------------ 로컬 상태 ------------------
const nickname = ref(authStore.userInfo?.nickname || '');
const formData = ref({ ...userStore.healthInfo });
const originalFormData = ref(null);
const isEditMode = ref(false);

const fileToUpload = ref(null);
const currentPreviewUrl = ref(null);
const currentProfileImage = computed(
  () => authStore.userInfo?.profileImageUrl || null,
);

const formMsg = ref('');
const formMsgStatus = ref('');

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

// 입력값 변경 시 에러 메시지 실시간 초기화
watch(
  () => [
    nickname.value,
    formData.value.height_cm,
    formData.value.weight_kg,
    formData.value.gender,
  ],
  newValues => {
    // 에러 상태일 때만 초기화 (성공 메시지는 유지하고 싶을 수 있으므로)
    if (formMsgStatus.value === 'error') {
      // 모든 필수 값이 존재한다면 메시지 삭제
      const hasAllRequired = newValues.every(
        v => v !== null && v !== '' && v !== 0,
      );
      if (hasAllRequired) {
        formMsg.value = '';
        formMsgStatus.value = '';
      }
    }
  },
  { deep: true },
);

// 수정 UI 토글 및 취소
const startEditMode = () => {
  isEditMode.value = true;
  formMsg.value = '';
  originalFormData.value = { ...formData.value, nickname: nickname.value };
};

const cancelEditMode = () => {
  if (originalFormData.value) {
    nickname.value = originalFormData.value.nickname;
    formData.value = { ...originalFormData.value };
  }
  isEditMode.value = false;
  fileToUpload.value = null;
  currentPreviewUrl.value = null;
};

//프로필 사진 삭제
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

    // 수정 완료, 조회 모드 복귀
    originalFormData.value = { ...formData.value, nickname: nickname.value };
    isEditMode.value = false;
  } catch (error) {
    console.error('통합 수정 실패:', error);
    formMsg.value = `수정에 실패했습니다. ${error.message || '서버 오류'}`;
    formMsgStatus.value = 'error';
  }
};
</script>
