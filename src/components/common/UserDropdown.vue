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

    <Teleport to="body">
      <div
        v-if="visible"
        class="fixed w-auto bg-white shadow-xl rounded-lg py-1 z-[9999]"
        :style="dropdownStyle"
        @mouseenter="openDropdown"
        @mouseleave="startCloseTimer"
      >
        <div class="flex items-center gap-3 px-4 py-4">
          <img
            :src="store.userInfo?.profileImageUrl || profileImg"
            @error="e => (e.target.src = profileImg)"
            class="w-10 h-10 rounded-full border border-[#D3A373] object-cover"
          />
          <div class="font-semibold text-sm truncate">
            {{ store.userInfo?.nickname }}님
          </div>
        </div>
        <hr class="border-gray-100 mb-1" />
        <div class="flex flex-col text-center">
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
    </Teleport>
  </div>
</template>

<script setup>
import {
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import profileImg from '@/assets/profile.jpg';

const store = useAuthStore();
const visible = ref(false);
const dropdownRef = ref(null);
const dropdownStyle = reactive({
  top: '0px',
  left: '0px',
  width: '192px', // w-48 대응
});
let closeTimeout = null;

const updatePosition = () => {
  if (dropdownRef.value) {
    const rect = dropdownRef.value.getBoundingClientRect();
    // 버튼의 오른쪽 끝에 드롭다운 오른쪽 끝을 맞춤 (오른쪽 정렬)
    dropdownStyle.top = `${rect.bottom + 8}px`;
    dropdownStyle.left = `${rect.right - 192}px`;
  }
};

const openDropdown = () => {
  clearTimeout(closeTimeout);
  updatePosition();
  visible.value = true;
};

const toggleDropdown = () => {
  if (visible.value) close();
  else openDropdown();
};

const close = () => {
  clearTimeout(closeTimeout);
  visible.value = false;
};

const startCloseTimer = () => {
  clearTimeout(closeTimeout);
  closeTimeout = setTimeout(() => {
    close();
  }, 300);
};

const logout = () => {
  store.logout();
  close();
};

const handleClickOutside = e => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    // Teleport된 드롭다운 자체를 클릭한 경우도 체크해야 할 수도 있음
    const dropdownEl = document.querySelector('.fixed.bg-white.shadow-xl');
    if (dropdownEl && dropdownEl.contains(e.target)) return;
    close();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', updatePosition);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', updatePosition);
  window.removeEventListener('resize', updatePosition);
});
</script>
