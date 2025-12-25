<template>
  <transition name="header-slide">
    <header
      v-show="isVisible"
      class="w-full bg-white shadow-sm backdrop-blur-sm fixed top-0 z-50 transition-all duration-300"
    >
      <div
        class="max-w-[1440px] mx-auto flex items-center h-18 px-6 md:px-12 lg:px-20"
      >
        <div class="flex-1 flex justify-start">
          <RouterLink
            to="/dashboard"
            class="text-2xl font-bold text-blue-600 select-none transition-transform hover:scale-105"
          >
            <img
              src="@/assets/FitmeetLogo3.png"
              alt="로고"
              class="w-24 md:w-24"
            />
          </RouterLink>
        </div>

        <nav
          class="hidden md:flex items-center gap-8 lg:gap-12 text-gray-700 font-medium"
        >
          <RouterLink
            to="/dashboard"
            class="hover:text-emerald-600 relative group transition duration-300"
          >
            대시보드
            <span
              class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-emerald-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
            ></span>
          </RouterLink>
          <RouterLink
            to="/diet"
            class="hover:text-emerald-600 relative group transition duration-300"
          >
            식단관리
            <span
              class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-emerald-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
            ></span>
          </RouterLink>
          <RouterLink
            to="/community"
            class="hover:text-emerald-600 relative group transition duration-300"
          >
            커뮤니티
            <span
              class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-emerald-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
            ></span>
          </RouterLink>
          <RouterLink
            to="/training"
            class="hover:text-emerald-600 relative group transition duration-300"
          >
            트레이닝
            <span
              class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-emerald-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
            ></span>
          </RouterLink>
        </nav>

        <div class="flex-1 flex justify-end items-center z-90">
          <div class="hidden md:flex items-center gap-4 lg:gap-6">
            <template v-if="!authStore.isLoggedIn">
              <RouterLink
                to="/auth/login"
                class="hover:text-blue-600 text-sm lg:text-base"
                >로그인</RouterLink
              >
              <span class="text-gray-300 text-xs">|</span>
              <RouterLink
                to="/auth/signup"
                class="hover:text-blue-600 text-sm lg:text-base"
                >회원가입</RouterLink
              >
            </template>
            <UserDropdown v-else class="hover:cursor-pointer z-90" />
          </div>

          <button
            class="md:hidden text-gray-700 p-2"
            @click="$emit('open-menu')"
          >
            <Bars3Icon class="w-8 h-8" />
          </button>
        </div>
      </div>
    </header>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/Auth';
import UserDropdown from '@/components/common/UserDropdown.vue';
import MobileSidebar from '@/components/common/MobileSidebar.vue';

const authStore = useAuthStore();
const open = ref(false);
const isVisible = ref(true);
let lastScrollPosition = 0;

// 스크롤 감지 핸들러
const handleScroll = () => {
  const currentScroll = window.scrollY;
  // 최상단이거나 위로 올릴 때 보임
  if (currentScroll < 50) {
    isVisible.value = true;
  } else {
    isVisible.value = currentScroll < lastScrollPosition;
  }
  lastScrollPosition = currentScroll;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
/* 헤더 슬라이딩 애니메이션 */
.header-slide-enter-active,
.header-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.header-slide-enter-from,
.header-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
