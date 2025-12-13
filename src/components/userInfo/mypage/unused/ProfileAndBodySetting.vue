<template>
  <div class="p-4 rounded-lg bg-white max-w-3xl mx-auto">
    <form @submit.prevent="submitAllUpdates" class="flex flex-col gap-10">
      <section class="border-b pb-8 border-gray-200">
        <h4 class="text-xl font-semibold text-[#8A8F6E] mb-5">기본 정보</h4>

        <div class="flex flex-col items-center gap-4 mb-8">
          <img
            :src="currentPreviewUrl || currentProfileImage"
            alt="프로필 미리보기"
            class="w-32 h-32 rounded-full object-cover border-4 border-[#D3A373] shadow-md transition-all duration-300"
          />

          <div class="flex gap-3" v-if="isEditMode">
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
              class="px-4 py-2 text-white rounded-xl bg-[#8A8F6E] hover:bg-[#6e7256] transition shadow cursor-pointer text-sm font-medium"
            >
              {{ fileToUpload ? '사진 변경' : '사진 선택' }}
            </label>
            <button
              v-if="fileToUpload || currentProfileImage !== defaultProfileImg"
              type="button"
              @click="deleteImage"
              class="px-4 py-2 text-sm font-medium text-gray-700 rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow cursor-pointer"
            >
              사진 삭제
            </button>
          </div>

          <button
            v-if="fileToUpload && isEditMode"
            type="button"
            @click="uploadProfileImage"
            class="w-48 py-2 mt-2 text-white text-sm font-semibold rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow"
          >
            프로필 사진 저장
          </button>
        </div>

        <div class="flex flex-col gap-3">
          <label class="text-base font-semibold text-[#8A8F6E]">닉네임</label>
          <input
            type="text"
            v-model="nickname"
            placeholder="새 닉네임을 입력하세요"
            :readonly="!isEditMode"
            :class="[
              'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition',
              isEditMode
                ? 'bg-white focus:ring-2 focus:ring-[#D3A373]'
                : 'bg-gray-100 cursor-default text-gray-700',
            ]"
          />
        </div>

        <div class="flex flex-col mt-4">
          <label class="text-base font-semibold text-[#8A8F6E]">이메일</label>
          <input
            type="email"
            :value="authStore.userInfo?.email"
            readonly
            class="px-4 py-3 rounded-xl border border-[#D3D7B5] bg-gray-100 cursor-not-allowed text-gray-500"
          />
        </div>
      </section>

      <section>
        <h4 class="text-xl font-semibold text-[#8A8F6E] mb-5">
          건강 및 신체 정보
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium text-gray-700"
              >현재 키 (cm)</label
            >
            <input
              type="number"
              v-model.number="formData.height_cm"
              min="130"
              max="200"
              step="0.5"
              placeholder="키"
              :readonly="!isEditMode"
              :class="[
                'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition',
                isEditMode
                  ? 'bg-white focus:ring-2 focus:ring-[#D3A373]'
                  : 'bg-gray-100 cursor-default text-gray-700',
              ]"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-base font-medium text-gray-700"
              >현재 체중 (kg)</label
            >
            <input
              type="number"
              v-model.number="formData.weight_kg"
              min="40"
              max="150"
              step="0.5"
              placeholder="체중"
              :readonly="!isEditMode"
              :class="[
                'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition',
                isEditMode
                  ? 'bg-white focus:ring-2 focus:ring-[#D3A373]'
                  : 'bg-gray-100 cursor-default text-gray-700',
              ]"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-base font-medium text-gray-700"
              >목표 체중 (kg)</label
            >
            <input
              type="number"
              v-model.number="formData.target_weight_kg"
              min="30"
              max="150"
              step="0.5"
              placeholder="목표 체중"
              :readonly="!isEditMode"
              :class="[
                'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition',
                isEditMode
                  ? 'bg-white focus:ring-2 focus:ring-[#D3A373]'
                  : 'bg-gray-100 cursor-default text-gray-700',
              ]"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-base font-medium text-gray-700">생년월일</label>
            <input
              type="date"
              v-model="formData.birth_date"
              :readonly="!isEditMode"
              :class="[
                'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition',
                isEditMode
                  ? 'bg-white focus:ring-2 focus:ring-[#D3A373]'
                  : 'bg-gray-100 cursor-default text-gray-700',
              ]"
            />
          </div>

          <div class="flex flex-col gap-2 sm:col-span-2">
            <label class="text-base font-medium text-gray-700">성별</label>
            <div class="flex gap-4">
              <button
                type="button"
                @click="formData.gender = 'MALE'"
                :disabled="!isEditMode"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl border text-base font-medium transition',
                  formData.gender === 'MALE'
                    ? 'bg-[#D3A373] text-white border-[#D3A373]'
                    : isEditMode
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-500 border-gray-300 cursor-default',
                  !isEditMode &&
                    formData.gender === 'MALE' &&
                    'bg-[#D3A373] bg-opacity-70 text-white border-[#D3A373] border-opacity-70 cursor-default',
                ]"
              >
                남성
              </button>
              <button
                type="button"
                @click="formData.gender = 'FEMALE'"
                :disabled="!isEditMode"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl border text-base font-medium transition',
                  formData.gender === 'FEMALE'
                    ? 'bg-[#D3A373] text-white border-[#D3A373]'
                    : isEditMode
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-500 border-gray-300 cursor-default',
                  !isEditMode &&
                    formData.gender === 'FEMALE' &&
                    'bg-[#D3A373] bg-opacity-70 text-white border-[#D3A373] border-opacity-70 cursor-default',
                ]"
              >
                여성
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:col-span-2">
            <label class="text-base font-medium text-gray-700"
              >평소 활동량</label
            >
            <select
              v-model="formData.activity_level"
              :disabled="!isEditMode"
              :class="[
                'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none appearance-none transition', // appearance-none으로 드롭다운 화살표 숨기기
                isEditMode
                  ? 'bg-white focus:ring-2 focus:ring-[#D3A373]'
                  : 'bg-gray-100 cursor-default text-gray-700',
              ]"
            >
              <option value="NONE">거의 없음</option>
              <option value="LOW">낮음</option>
              <option value="MID">보통</option>
              <option value="HIGH">높음</option>
            </select>
          </div>
        </div>
      </section>

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
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { useUserStore } from '@/stores/User';
import defaultProfileImg from '@/assets/profile.png';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

// ------------------ 로컬 상태 ------------------
// 닉네임은 AuthStore에서 가져오지만, 입력 상태로 사용하기 위해 ref로 복사
const nickname = ref(authStore.userInfo?.nickname || '');
const formData = ref({ ...userStore.healthInfo });
const originalFormData = ref(null);
const isEditMode = ref(false);
// 프로필 사진 로직 상태
const fileToUpload = ref(null);
const currentPreviewUrl = ref(null);
const currentProfileImage = computed(
  () => authStore.userInfo?.profileImageUrl || defaultProfileImg,
);

// 폼 메시지
const formMsg = ref('');
const formMsgStatus = ref('');
const formMsgStatusClass = computed(() => {
  return formMsgStatus.value === 'error' ? 'text-red-600' : 'text-green-600';
});

const loadInitialData = async () => {
  if (!userStore.healthInfo.height_cm) {
    await authStore.fetchAllUserInfo();
  }
  // Pinia Store의 데이터로 로컬 상태 초기화
  nickname.value = authStore.userInfo?.nickname || '';
  formData.value = { ...userStore.healthInfo };

  // 원본 데이터 저장 (편집 취소 시 복원용)
  originalFormData.value = { ...formData.value, nickname: nickname.value };
};
// 컴포넌트 마운트 시 데이터가 없으면 로드 시도 (최초 로그인 후 진입 시)
onMounted(async () => {
  if (!userStore.healthInfo.height_cm) {
    await authStore.fetchAllUserInfo();
  }

  formData.value = { ...userStore.healthInfo };
});

watch(
  () => userStore.healthInfo,
  newHealthInfo => {
    // Pinia Store의 객체가 변경될 때마다 로컬 formData를 새 데이터로 덮어씌웁니다.
    formData.value = { ...newHealthInfo };
  },
  { deep: true, immediate: true },
); // immediate: true를 사용하여 초기 로드된 값도 즉시 반영

const startEditMode = () => {
  isEditMode.value = true;
  formMsg.value = ''; // 메시지 초기화
  // 현재 상태를 원본에 저장 (취소 시 복원용)
  originalFormData.value = { ...formData.value, nickname: nickname.value };
};

// 🚨 [추가] 편집 모드 취소 (데이터 원복)
const cancelEditMode = () => {
  if (originalFormData.value) {
    nickname.value = originalFormData.value.nickname;
    formData.value = { ...originalFormData.value };
  }
  isEditMode.value = false;
  formMsg.value = '수정 모드가 취소되었습니다.';
  formMsgStatus.value = 'error';
};

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

// ------------------ 최종 통합 수정 로직 (닉네임 + 신체 정보) ------------------

const submitAllUpdates = async () => {
  formMsg.value = '';

  if (!nickname.value.trim()) {
    formMsg.value = '닉네임을 입력해주세요.';
    formMsgStatus.value = 'error';
    return;
  }
  const submitAllUpdates = async () => {
    formMsg.value = '';

    if (!nickname.value.trim()) {
      formMsg.value = '닉네임을 입력해주세요.';
      formMsgStatus.value = 'error';
      return;
    }

    // 신체 정보 필수 필드 검사 추가 (DB에 NULL 허용이므로 클라이언트 UX용)
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

    // 🚨 닉네임과 신체 정보를 모두 담아 UserStore의 액션을 호출합니다.
    try {
      // 서버가 요구하는 카멜 케이스(camelCase)로 매핑
      const payload = {
        nickname: nickname.value,
        heightCm: formData.value.height_cm,
        weightKg: formData.value.weight_kg,
        targetWeightKg: formData.value.target_weight_kg,
        gender: formData.value.gender,

        // birthDate 처리: formData.value.birth_date로 접근
        // birthDate:
        //   formData.value.birth_date instanceof Date
        //     ? formData.value.birth_date.toISOString().split('T')[0]
        //     : formData.value.birth_date,

        // activityLevel: formData.value.activity_level,
        // birthDate 처리: 데이터가 null이 아닌 경우에만 포맷팅
        birthDate: formData.value.birth_date
          ? formData.value.birth_date instanceof Date
            ? formData.value.birth_date.toISOString().split('T')[0]
            : formData.value.birth_date
          : null,

        activityLevel: formData.value.activity_level || 'NONE',
      };

      // UserStore의 updateUserProfileInfo는 내부적으로 AuthStore를 업데이트합니다.
      await userStore.updateUserProfileInfo(payload);
      // 🚨 [수정] 성공 시 alert 창 띄우기
      alert('프로필 및 신체 정보가 성공적으로 수정되었습니다.');

      isEditMode.value = false; // 수정 완료 후 조회 모드로 복귀
    } catch (error) {
      console.error('통합 수정 실패:', error);
      formMsg.value = `수정에 실패했습니다. ${error.message || '서버 오류'}`;
      formMsgStatus.value = 'error';
    }
  };
};
</script>
