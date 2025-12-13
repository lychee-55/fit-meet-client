<template>
  <div
    class="fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col"
    :class="open ? 'translate-x-0 w-3/4' : 'translate-x-full w-3/4'"
  >
    <div class="flex justify-between items-center pl-12 pr-10 py-4 shadow-sm">
      <span class="text-xl font-bold">메뉴</span>
      <button class="text-2xl" @click="close">
        <XMarkIcon class="w-8 h-8" />
      </button>
    </div>

    <nav
      class="flex flex-col gap-8 p-12 text-lg font-medium flex-1 overflow-y-auto"
    >
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

      <RouterLink to="/workout" @click="close" class="flex items-center gap-3">
        <PlayCircleIcon class="w-6 h-6 text-gray-600" />
        운동영상
      </RouterLink>
    </nav>

    <template v-if="store.isLoggedIn">
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
          <span>마이페이지</span>
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
    </template>

    <div
      v-else
      class="w-full px-16 py-6 border-t border-gray-200 flex justify-between text-lg font-medium"
    >
      <RouterLink to="/auth/login" @click="close" class="hover:text-blue-600"
        >로그인</RouterLink
      >
      <RouterLink to="/auth/signup" @click="close" class="hover:text-blue-600"
        >회원가입</RouterLink
      >
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
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/Auth';
import profileImg from '@/assets/profile.png';
import { watch } from 'vue';

const props = defineProps({
  open: Boolean,
  close: Function,
});

//디버깅용 추후 삭제
watch(
  () => props.open,
  newVal => {
    // console.log('Sidebar Open Status:', newVal);
  },
  { immediate: true },
);

const store = useAuthStore();

const handleLogout = () => {
  store.logout();
  props.close();
};
</script>
