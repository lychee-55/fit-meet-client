<template>
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
          @change="$emit('file-change', $event)"
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
          @click="$emit('delete-image')"
          class="px-4 py-2 text-sm font-medium text-gray-700 rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow cursor-pointer"
        >
          사진 삭제
        </button>
      </div>

      <button
        v-if="fileToUpload && isEditMode"
        type="button"
        @click="$emit('upload-image')"
        class="w-48 py-2 mt-2 text-white text-sm font-semibold rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow"
      >
        프로필 사진 저장
      </button>
    </div>

    <div class="flex flex-col gap-3">
      <label class="text-base font-semibold text-[#8A8F6E]">닉네임</label>
      <input
        type="text"
        :value="nickname"
        @input="$emit('update:nickname', $event.target.value)"
        placeholder="새 닉네임을 입력하세요"
        :readonly="!isEditMode"
        :class="nicknameInputClasses"
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
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import defaultProfileImg from '@/assets/profile.png';

const authStore = useAuthStore();

const props = defineProps({
  nickname: String,
  isEditMode: Boolean,
  fileToUpload: [File, null],
  currentPreviewUrl: [String, null],
  currentProfileImage: String,
});

const emit = defineEmits([
  'update:nickname',
  'file-change',
  'delete-image',
  'upload-image',
]);

const nicknameInputClasses = computed(() => {
  const base =
    'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition';
  const edit = 'bg-white focus:ring-2 focus:ring-[#D3A373]';
  const view = 'bg-gray-100 cursor-default text-gray-700';

  return [base, props.isEditMode ? edit : view];
});
</script>
