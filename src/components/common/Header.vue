<template>
  <header class="w-full bg-white border-b shadow-sm">
    <!-- 모바일(px-4), 데스크탑(px-0) -->
    <div class="grid grid-cols-12 items-center h-16 px-4 md:px-0">
      <!-- 좌측 여백 (모바일엔 없음) -->
      <div class="hidden md:block md:col-span-1"></div>

      <!-- 가운데 -->
      <div class="col-span-12 md:col-span-10 flex justify-between items-center">
        <!-- 로고 -->
        <div class="text-2xl font-bold text-blue-600 select-none">FITMIT</div>

        <!-- 데스크탑 네비 -->
        <nav
          class="hidden md:flex items-center gap-8 text-gray-700 font-medium"
        >
          <RouterLink to="/dashboard" class="hover:text-blue-600"
            >대시보드</RouterLink
          >
          <RouterLink to="/diet" class="hover:text-blue-600"
            >식단관리</RouterLink
          >
          <RouterLink to="/workout" class="hover:text-blue-600"
            >운동영상</RouterLink
          >

          <div class="flex items-center gap-4 ml-4">
            <RouterLink to="/auth/login" class="hover:text-blue-600"
              >로그인</RouterLink
            >
            <span class="text-gray-400">|</span>
            <RouterLink to="/auth/signup" class="hover:text-blue-600"
              >회원가입</RouterLink
            >
          </div>
        </nav>

        <!-- 모바일 햄버거 -->
        <button class="md:hidden text-3xl" @click="open = true">
          <Bars3Icon class="w-8 h-8" />
        </button>
      </div>

      <!-- 우측 여백 (모바일 없음) -->
      <div class="hidden md:block md:col-span-1"></div>
    </div>

    <!-- 오버레이 -->
    <div
      v-if="open"
      class="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
      @click="closeMenu"
    ></div>

    <!-- 모바일 사이드 메뉴 -->
    <div
      class="fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-50 transform transition-transform duration-300"
      :class="open ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex justify-between items-center p-6 border-b">
        <span class="text-xl font-bold">메뉴</span>
        <button class="text-2xl" @click="closeMenu">
          <XMarkIcon class="w-8 h-8" />
        </button>
      </div>

      <nav class="flex flex-col gap-6 p-10 text-lg font-medium">
        <RouterLink to="/dashboard" @click="closeMenu">대시보드</RouterLink>
        <RouterLink to="/diet" @click="closeMenu">식단관리</RouterLink>
        <RouterLink to="/workout" @click="closeMenu">운동영상</RouterLink>
      </nav>

      <div class="absolute bottom-6 w-full px-10">
        <div class="flex justify-between text-lg font-medium">
          <RouterLink to="/auth/login" @click="closeMenu">로그인</RouterLink>
          <RouterLink to="/auth/signup" @click="closeMenu">회원가입</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

defineOptions({ name: 'AppHeader' });

const open = ref(false);
const closeMenu = () => (open.value = false);
</script>

<style scoped></style>
