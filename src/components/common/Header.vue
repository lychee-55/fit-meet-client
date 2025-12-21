<template>
  <transition name="header-slide">
    <header
      v-show="isVisible"
      class="w-full bg-white shadow-sm backdrop-blur-sm fixed top-0 z-50 transition-all duration-300"
    >
      <div class="grid grid-cols-12 items-center h-18 px-4 md:px-0">
        <div class="hidden md:block md:col-span-1"></div>

        <div class="col-span-12 md:col-span-10 flex items-center">
          <div class="text-2xl font-bold text-blue-600 select-none mr-auto">
            <img src="@/assets/FitmeetLogo.png" alt="로고" class="w-20" />
          </div>

          <div class="hidden md:flex items-center justify-center grow">
            <nav class="flex items-center gap-12 text-gray-700 font-medium">
              <RouterLink
                to="/dashboard"
                class="hover:text-blue-600 relative group transition duration-300"
              >
                대시보드

                <span
                  class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
                ></span>
              </RouterLink>

              <RouterLink
                to="/diet"
                class="hover:text-blue-600 relative group transition duration-300"
              >
                식단관리

                <span
                  class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
                ></span>
              </RouterLink>

              <RouterLink
                to="/community"
                class="hover:text-blue-600 relative group transition duration-300"
              >
                커뮤니티

                <span
                  class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
                ></span>
              </RouterLink>

              <RouterLink
                to="/training"
                class="hover:text-blue-600 relative group transition duration-300"
              >
                운동영상

                <span
                  class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
                ></span>
              </RouterLink>
            </nav>
          </div>

          <div class="items-center gap-4 hidden md:flex">
            <template v-if="!authStore.isLoggedIn">
              <RouterLink to="/auth/login" class="hover:text-blue-600"
                >로그인</RouterLink
              >
              <span class="text-gray-400">|</span>
              <RouterLink to="/auth/signup" class="hover:text-blue-600"
                >회원가입</RouterLink
              >
            </template>
            <UserDropdown v-else class="hover:cursor-pointer" />
          </div>

          <button
            class="md:hidden text-3xl ml-auto"
            @click="$emit('open-menu')"
          >
            <Bars3Icon class="w-8 h-8" />
          </button>
        </div>

        <div class="hidden md:block md:col-span-1"></div>
      </div>

      <!-- <div
        v-if="open"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        @click="open = false"
      ></div> -->

      <!-- <MobileSidebar :open="open" :close="() => (open = false)" /> -->
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
