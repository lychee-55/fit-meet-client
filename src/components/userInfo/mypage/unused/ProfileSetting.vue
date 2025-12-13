<template>
  <div class="p-4 border border-gray-100 rounded-lg bg-white">
    <!-- <h3 class="text-xl font-semibold text-gray-700 mb-2">내 프로필 수정</h3>
    <hr /> -->

    <form @submit.prevent="submitProfileUpdate" class="flex flex-col gap-7">
      <div class="flex flex-col gap-3">
        <label class="text-base font-semibold text-[#8A8F6E]"
          >프로필 사진</label
        >

        <div class="flex justify-center items-center h-32">
          <img
            :src="currentPreviewUrl || currentProfileImage"
            alt="프로필 미리보기"
            class="w-32 h-32 rounded-full object-cover border-4 border-[#D3A373] shadow-md transition-all duration-300"
          />
        </div>

        <div class="flex justify-center mt-3">
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*"
            ref="fileInput"
            id="profile-file-input-update"
            class="hidden"
          />

          <label
            for="profile-file-input-update"
            class="w-30 text-center px-4 py-3 text-white rounded-xl bg-[#8A8F6E] hover:bg-[#6e7256] transition shadow cursor-pointer text-sm font-medium mr-3"
          >
            {{ fileToUpload ? '사진 변경' : '사진 선택' }}
          </label>

          <button
            v-if="fileToUpload || currentProfileImage !== defaultProfileImg"
            type="button"
            @click="deleteImage"
            class="w-30 text-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow cursor-pointer"
          >
            사진 삭제
          </button>
        </div>

        <button
          v-if="fileToUpload"
          type="button"
          @click="uploadProfileImage"
          class="w-full py-3 mt-4 text-white text-base font-semibold rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow"
        >
          선택된 프로필 사진 저장
        </button>
      </div>

      <div class="border-t border-gray-200 pt-7"></div>

      <div class="flex flex-col">
        <label class="text-base font-semibold text-[#8A8F6E]">이메일</label>
        <input
          type="email"
          v-model="email"
          readonly
          class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-gray-100 cursor-not-allowed text-gray-500"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-base font-semibold text-[#8A8F6E]">닉네임</label>

        <div class="flex gap-3 mt-2">
          <input
            type="text"
            v-model="nickname"
            placeholder="새 닉네임을 입력하세요"
            class="flex-1 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
          />
          <button
            type="button"
            @click="updateNickname"
            class="px-4 py-3 text-white rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow whitespace-nowrap"
          >
            저장
          </button>
        </div>

        <p v-if="nicknameMsg" class="mt-1 text-sm" :class="nicknameStatusClass">
          {{ nicknameMsg }}
        </p>
      </div>

      <p
        v-if="formMsg"
        class="mt-3 text-sm font-medium"
        :class="formMsgStatusClass"
      >
        {{ formMsg }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { useUserStore } from '@/stores/User'; // useUserStore 임포트
import defaultProfileImg from '@/assets/profile.png';

// ------------------ Store & 데이터 참조 ------------------
const authStore = useAuthStore();
const userStore = useUserStore();

// 초기값은 AuthStore의 현재 로그인된 유저 정보로 설정
const email = computed(() => authStore.userInfo?.email || 'user@example.com');
const nickname = ref(authStore.userInfo?.nickname || '사용자');
// AuthStore의 프로필 이미지 URL을 직접 참조하여 실시간 업데이트
const currentProfileImage = computed(
  () => authStore.userInfo?.profileImageUrl || defaultProfileImg,
);

// ------------------ 폼 메시지 및 상태 ------------------
const formMsg = ref('');
const formMsgStatus = ref(''); // 'success', 'error'
const formMsgStatusClass = computed(() => {
  return formMsgStatus.value === 'error' ? 'text-red-600' : 'text-green-600';
});

// 닉네임 상태 (닉네임 중복 확인 등의 메시지 용도)
const nicknameMsg = ref('');
const nicknameStatus = ref('');
const nicknameStatusClass = computed(() => {
  return nicknameStatus.value === 'error' ? 'text-red-600' : 'text-green-600';
});

// ------------------ 프로필 사진 로직 ------------------
const fileToUpload = ref(null);
const currentPreviewUrl = ref(null);

const handleFileChange = event => {
  const file = event.target.files[0];
  if (file) {
    fileToUpload.value = file;
    currentPreviewUrl.value = URL.createObjectURL(file);
    formMsg.value =
      '사진이 선택되었습니다. "선택된 프로필 사진 저장" 버튼을 눌러주세요.';
    formMsgStatus.value = 'success';
  } else {
    fileToUpload.value = null;
    currentPreviewUrl.value = null;
  }
};

const deleteImage = async () => {
  formMsg.value = '';

  // 1. 선택된 파일 미리보기 제거
  fileToUpload.value = null;
  currentPreviewUrl.value = null;

  // 2. 현재 이미지가 기본 이미지가 아닐 경우, 서버에 삭제 요청
  if (
    authStore.userInfo?.profileImageUrl &&
    authStore.userInfo.profileImageUrl !== defaultProfileImg
  ) {
    try {
      await userStore.deleteUserProfileImg();
      formMsg.value = '프로필 이미지가 삭제되고 기본 이미지로 설정되었습니다.';
      formMsgStatus.value = 'success';
    } catch (error) {
      formMsg.value = '이미지 삭제에 실패했습니다. ' + error.message;
      formMsgStatus.value = 'error';
    }
  } else {
    formMsg.value = '프로필 사진이 초기화되었습니다.';
    formMsgStatus.value = 'success';
  }
};

// ------------------ API 호출 로직 ------------------

// API 1: 닉네임 수정
const updateNickname = async () => {
  formMsg.value = '';

  if (!nickname.value.trim()) {
    nicknameMsg.value = '닉네임을 입력해주세요.';
    nicknameStatus.value = 'error';
    return;
  }

  try {
    await userStore.updateUserProfileInfo({ nickname: nickname.value });

    formMsg.value = '닉네임이 성공적으로 변경되었습니다.';
    formMsgStatus.value = 'success';
    nicknameStatus.value = '';
  } catch (error) {
    console.error('닉네임 수정 실패:', error);
    formMsg.value = '닉네임 수정에 실패했습니다. (중복 혹은 서버 오류)';
    formMsgStatus.value = 'error';
    nicknameStatus.value = 'error';
    nicknameMsg.value = error.message || '수정 실패';
  }
};

// API 2: 프로필 이미지 수정/업로드
const uploadProfileImage = async () => {
  formMsg.value = '';

  if (!fileToUpload.value) {
    formMsg.value = '업로드할 파일이 없습니다.';
    formMsgStatus.value = 'error';
    return;
  }

  const formData = new FormData();
  formData.append('profileImage', fileToUpload.value);

  try {
    // Store 액션 호출
    await userStore.updateUserProfileImg(formData);

    // 성공 시 미리보기 상태 초기화
    fileToUpload.value = null;
    currentPreviewUrl.value = null;

    formMsg.value = '프로필 이미지가 성공적으로 업로드 및 변경되었습니다.';
    formMsgStatus.value = 'success';
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error);
    formMsg.value = '이미지 업로드에 실패했습니다. (파일 크기 등 확인)';
    formMsgStatus.value = 'error';
  }
};
</script>
