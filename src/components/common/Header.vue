<template>
  <header
    class="w-full bg-white/90 shadow-sm backdrop-blur-sm sticky top-0 z-10"
  >
    <div class="grid grid-cols-12 items-center h-16 px-4 md:px-0">
      <div class="hidden md:block md:col-span-1"></div>

      <div class="col-span-12 md:col-span-10 flex items-center">
        <div class="text-2xl font-bold text-blue-600 select-none mr-auto">
          FIT-MEET
        </div>

        <div class="hidden md:flex items-center justify-center flex-grow">
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
              to="/workout"
              class="hover:text-blue-600 relative group transition duration-300"
            >
              운동영상
              <span
                class="absolute bottom-[-5px] left-1/2 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0"
              ></span>
            </RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-4 hidden md:flex">
          <template v-if="!store.isLoggedIn">
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

        <button class="md:hidden text-3xl ml-auto" @click="open = true">
          <Bars3Icon class="w-8 h-8" />
        </button>
      </div>

      <div class="hidden md:block md:col-span-1"></div>
    </div>

    <div
      v-if="open"
      class="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
      @click="closeMenu"
    ></div>

    <MobileSidebar :open="open" :close="closeMenu" />
  </header>
</template>

<script setup>
// 스크립트 부분은 동일합니다.
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/Auth';
import UserDropdown from '@/components/common/UserDropdown.vue';
import MobileSidebar from '@/components/common/MobileSidebar.vue';

const store = useAuthStore();
const open = ref(false);

const closeMenu = () => (open.value = false);
</script>
