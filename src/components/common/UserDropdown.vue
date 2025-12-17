<template>
  <div
    class="relative"
    ref="dropdownRef"
    @mouseenter="openDropdown"
    @mouseleave="startCloseTimer"
  >
    <button
      @click.stop
      class="w-10 h-10 rounded-full overflow-hidden hover:cursor-pointer border border-transparent hover:border-[#D3A373] transition"
    >
      <img
        :src="store.userInfo?.profileImageUrl || profileImg"
        class="w-10 h-10 rounded-full object-cover"
      />
    </button>

    <div
      v-if="visible"
      class="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-1 z-50"
    >
      <div class="flex items-center gap-3 px-4 py-2 mb-2">
        <img
          :src="store.userInfo?.profileImageUrl || profileImg"
          @error="e => (e.target.src = profileImg)"
          class="w-10 h-10 rounded-full border border-[#D3A373] object-cover"
        />
        <div class="font-semibold text-sm truncate">
          {{ store.userInfo?.nickname }}님
        </div>
      </div>

      <hr class="text-gray-200" />

      <div class="flex flex-col py-1">
        <RouterLink
          to="/my-page"
          class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
          @click="close"
        >
          <Cog6ToothIcon class="w-5 h-5 text-gray-500" />
          마이페이지
        </RouterLink>

        <button
          class="flex items-center gap-3 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600 transition duration-150"
          @click="logout"
        >
          <ArrowLeftStartOnRectangleIcon class="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 스크립트 부분은 변경 없음
import {
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import profileImg from '@/assets/profile.png';

const store = useAuthStore();
const visible = ref(false);
const dropdownRef = ref(null);
let closeTimeout = null; // 닫기 타이머를 저장할 변수

const openDropdown = () => {
  // 열 때 닫기 타이머가 실행 중이면 취소
  clearTimeout(closeTimeout);
  visible.value = true;
};

const close = () => {
  clearTimeout(closeTimeout);
  visible.value = false;
};

// 마우스가 영역을 벗어났을 때, 300ms 딜레이 후 닫습니다.
const startCloseTimer = () => {
  clearTimeout(closeTimeout); // 기존 타이머를 확실히 제거
  closeTimeout = setTimeout(() => {
    close();
  }, 300); // 300ms (0.3초) 지연
};

const logout = () => {
  store.logout();
  close();
};

const handleClickOutside = e => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    close();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener('click', handleClickOutside),
);
</script>

<style scoped></style>
