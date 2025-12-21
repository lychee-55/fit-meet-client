<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-70"
    @click="close"
  ></div>
  <div
    class="fixed top-0 right-0 h-screen bg-white shadow-xl z-80 transform transition-transform duration-300 flex flex-col"
    :class="open ? 'translate-x-0 w-3/4' : 'translate-x-full w-3/4'"
  >
    <!-- 헤더 -->
    <div class="flex justify-between items-center pl-12 pr-10 py-4 shadow-sm">
      <span class="text-xl font-bold">메뉴</span>
      <button class="text-2xl" @click="close">
        <XMarkIcon class="w-8 h-8" />
      </button>
    </div>

    <!-- 상단 메뉴 -->
    <nav class="flex flex-col gap-8 p-12 text-lg font-medium">
      <RouterLink
        to="/dashboard"
        @click="close"
        class="flex items-center gap-3"
      >
        <HomeIcon class="w-6 h-6 text-gray-600" />
        대시보드
      </RouterLink>

      <RouterLink to="/diet" @click="close" class="flex items-center gap-3">
        <ScaleIcon class="w-6 h-6 text-gray-600" />
        식단관리
      </RouterLink>

      <RouterLink
        to="/community"
        @click="close"
        class="flex items-center gap-3"
      >
        <UserGroupIcon class="w-6 h-6 text-gray-600" />
        커뮤니티
      </RouterLink>

      <RouterLink to="/training" @click="close" class="flex items-center gap-3">
        <PlayCircleIcon class="w-6 h-6 text-gray-600" />
        운동영상
      </RouterLink>
    </nav>

    <!-- 하단 영역 (로그인 여부에 따른 UI변경) -->
    <div class="mt-auto">
      <div v-if="store.isLoggedIn">
        <div class="flex flex-col p-12 pt-0 text-base font-medium gap-4">
          <button
            @click="handleLogout"
            class="flex items-center gap-3 text-gray-700 hover:text-red-600 text-left"
          >
            <ArrowLeftStartOnRectangleIcon class="w-5 h-5" />
            <span>로그아웃</span>
          </button>

          <RouterLink
            to="/my-page"
            @click="close"
            class="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Cog6ToothIcon class="w-5 h-5" />
            <span>설정</span>
          </RouterLink>
        </div>

        <div
          class="w-full px-10 py-4 shadow-sm flex items-center justify-between border-t border-gray-200"
        >
          <div class="flex items-center gap-5">
            <img
              :src="store.userInfo?.profileImageUrl || profileImg"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex flex-col">
              <span class="text-base text-gray-700 font-medium">
                환영합니다!
              </span>
              <span class="text-base text-gray-700 font-medium">
                {{ store.userInfo?.nickname }}님
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="w-full px-16 py-6 border-t border-gray-200 flex justify-between text-lg font-medium"
      >
        <RouterLink to="/auth/login" @click="close" class="hover:text-blue-600">
          로그인
        </RouterLink>
        <RouterLink
          to="/auth/signup"
          @click="close"
          class="hover:text-blue-600"
        >
          회원가입
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  XMarkIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
  ScaleIcon,
  PlayCircleIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/Auth';
import profileImg from '@/assets/profile.png';
import { watch } from 'vue';

const props = defineProps({
  open: Boolean,
  close: Function,
});

const store = useAuthStore();

const handleLogout = async () => {
  await store.logout();
  props.close();
};

watch(
  () => props.open,
  newVal => {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
);
</script>

<style scoped></style>
