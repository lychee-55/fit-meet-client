<template>
  <div
    :class="[
      'fixed bottom-10 left-1/2 -translate-x-1/2 z-50 border border-[#888d6a] h-16 ',
      'bg-[#8A8F6E]/94 backdrop-blur-sm rounded-full shadow-lg transition-all duration-600 ease-in-out',
      collapsed
        ? 'w-[125px] px-1 sm:px-4'
        : 'w-10/12 sm:w-9/12 md:w-8/12 lg:w-6/12 px-2 sm:px-6',
    ]"
  >
    <nav
      class="flex justify-between items-center text-white text-sm relative min-h-16"
      :class="[collapsed ? 'left-0' : '-left-2.5']"
    >
      <button
        v-if="collapsed"
        @click="collapsed = false"
        class="absolute text-white hover:text-gray-300 transition-all cursor-pointer"
        :class="[collapsed ? 'left-0' : 'left-3']"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>

      <div
        :class="[
          'flex-1 flex items-center transition-all duration-300 ease-in-out text-center',
          collapsed ? 'justify-center' : 'justify-evenly',
        ]"
      >
        <template v-if="!collapsed">
          <div class="block lg:hidden">
            <button
              @click="scrollToTop"
              class="flex flex-col justify-center items-center text-center"
            >
              <ChevronUpIcon class="w-6 h-6" />
              맨위로
            </button>
          </div>
          <RouterLink
            to="/community"
            label="홈"
            class="flex flex-col justify-center items-center text-center"
          >
            <HomeIcon class="w-6 h-6" />커뮤니티
          </RouterLink>
          <RouterLink
            to="/community/my-page"
            label="마이"
            class="flex flex-col justify-center items-center text-center"
          >
            <UserIcon class="w-6 h-6" />마이페이지
          </RouterLink>
          <!-- <RouterLink
            to="/li/user/profile"
            label="설정"
            class="flex flex-col justify-center items-center text-center"
          >
            <Cog6ToothIcon class="w-6 h-6" />
          </RouterLink> -->
          <RouterLink
            to="/community/form/create"
            label="작성"
            class="flex flex-col justify-center items-center text-center"
          >
            <PencilSquareIcon class="w-6 h-6" />작성
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink
            to="/community/form"
            label="작성"
            class="flex flex-col justify-center items-center text-center"
          >
            <PencilSquareIcon class="w-6 h-6" />작성
          </RouterLink>
        </template>
      </div>

      <button
        v-if="!collapsed"
        @click="collapsed = true"
        class="absolute right-0 sm:right-4 text-white hover:text-gray-300 transition-all cursor-pointer"
      >
        <ChevronRightIcon class="w-6 h-6" />
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
  HomeIcon,
  UserIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline';

// React의 useState(false)와 동일
const collapsed = ref(false);

// 최상단으로 부드럽게 이동
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// 내부 컴포넌트 대신 가독성을 위해 RouterLink 로직 정의 (또는 하단에 정의)
</script>
