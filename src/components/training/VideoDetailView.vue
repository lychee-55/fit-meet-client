<template>
  <div
    v-if="store.currentVideo"
    class="max-w-5xl mx-auto mt-6 border border-gray-100 rounded-2xl px-8 pb-8 pt-6 bg-white shadow-sm"
  >
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center text-gray-400 hover:text-[#8A8F6E] transition font-bold text-sm"
      >
        <ArrowLeftIcon class="w-5 h-5 mr-1" />
        <span>뒤로가기</span>
      </button>
    </div>
    <hr class="border-gray-100 mb-6" />
    <!-- <div class="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm"></div> -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <span
          class="px-3 py-1 bg-[#8A8F6E] text-white text-xs font-bold rounded-full"
        >
          {{
            CATEGORY_MODE[store.currentVideo.mainCategory] ||
            store.currentVideo.mainCategory
          }}
        </span>
        <span
          class="px-3 py-1 border border-gray-200 text-gray-600 text-xs font-bold rounded-full bg-white"
        >
          {{ store.currentVideo.level }}
        </span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        {{ store.currentVideo.title }}
      </h1>

      <div class="flex items-center gap-4 text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <EyeIcon class="w-4 h-4" />
          <span
            >조회수
            {{ store.currentVideo.youtubeViewCnt?.toLocaleString() }}회</span
          >
        </div>
        <span>•</span>
        <span>{{ formatDuration(store.currentVideo.durationSec) }}</span>
      </div>
    </div>

    <div
      class="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-6 bg-black"
    >
      <iframe
        :src="`https://www.youtube.com/embed/${store.currentVideo.youtubeVideoId}?autoplay=0&rel=0`"
        class="absolute top-0 left-0 w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    <div
      class="flex flex-wrap justify-between items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-6"
    >
      <div class="flex items-center gap-6">
        <button
          @click="store.toggleVideoLike(store.currentVideo.id)"
          class="flex items-center gap-2 group"
        >
          <div
            :class="store.currentVideo.liked ? 'bg-red-50' : 'bg-gray-50'"
            class="p-3 rounded-full transition-colors group-hover:bg-red-50"
          >
            <HeartIcon
              :class="
                store.currentVideo.liked
                  ? 'fill-red-400 text-red-400'
                  : 'text-gray-400'
              "
              class="w-7 h-7 transition-all group-active:scale-125"
            />
          </div>
          <div class="text-left">
            <p class="text-xs text-gray-400">좋아요</p>
            <p class="font-bold text-gray-700">
              {{ store.currentVideo.likeCount }}
            </p>
          </div>
        </button>
      </div>

      <button
        @click="store.toggleVideoComplete(store.currentVideo.id)"
        :class="
          store.currentVideo.completedToday ||
          store.currentVideo.completed ||
          store.currentVideo.doneBefore
            ? 'bg-[#8A8F6E] text-white'
            : 'bg-white border-2 border-[#8A8F6E] text-[#8A8F6E]'
        "
        class="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg active:scale-95"
      >
        <CheckBadgeIcon class="w-6 h-6" />
        {{
          store.currentVideo.completedToday ||
          store.currentVideo.completed ||
          store.currentVideo.doneBefore
            ? '오늘 운동 완료!'
            : '오늘의 운동 완료하기'
        }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
      <div class="lg:col-span-2">
        <h2
          class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
        >
          <DocumentTextIcon class="w-5 h-5 text-[#8A8F6E]" />
          운동 소개
        </h2>
        <div
          class="bg-white p-6 rounded-2xl border border-gray-100 min-h-[200px]"
        >
          <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {{ store.currentVideo.description }}
          </p>

          <div class="flex flex-wrap gap-2 mt-6">
            <span
              v-for="tag in store.currentVideo.tags"
              :key="tag"
              class="text-[#8A8F6E] text-sm font-medium"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-800 mb-4">운동 정보</h2>
        <div class="bg-gray-50 p-6 rounded-2xl space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-500">난이도</span>
            <span class="font-bold text-[#8A8F6E]">{{
              store.currentVideo.level
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">카테고리</span>
            <span class="font-bold text-gray-700">{{
              CATEGORY_MODE[store.currentVideo.mainCategory]
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">총 시간</span>
            <span class="font-bold text-gray-700">{{
              formatDuration(store.currentVideo.durationSec)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-gray-100 mb-6" />

    <VideoCommentSection
      :comments="store.currentVideo.comments"
      :video-id="store.currentVideo.id"
      @submit="handleCommentSubmit"
      @delete="handleCommentDelete"
    />
  </div>

  <div
    v-else-if="store.loading"
    class="flex flex-col items-center justify-center min-h-[600px]"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A8F6E]"
    ></div>
    <p class="mt-4 text-gray-500">영상을 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTrainingStore } from '@/stores/Training';
import {
  HeartIcon,
  EyeIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline';
import VideoCommentSection from './VideoCommentSection.vue';

const route = useRoute();
const router = useRouter();
const store = useTrainingStore();

const CATEGORY_MODE = {
  HOME: '홈트레이닝',
  YOGA: '요가',
  PILATES: '필라테스',
};

const handleCommentSubmit = async content => {
  await store.addVideoComment(store.currentVideo.id, content);
};

// 댓글 삭제 핸들러
const handleCommentDelete = async commentId => {
  await store.deleteVideoComment(store.currentVideo.id, commentId);
};

const formatDuration = sec => {
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${min}분 ${s.toString().padStart(2, '0')}초`;
};

onMounted(() => {
  store.fetchVideoDetail(route.params.id);
});

const goBack = () => {
  router.back();
};
</script>
