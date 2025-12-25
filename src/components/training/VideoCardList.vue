<template>
  <div
    :class="
      isSlider
        ? 'flex gap-6 transition-transform duration-500'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    "
  >
    <div
      v-for="video in videos"
      :key="video.id"
      class="group flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
      :style="isSlider ? 'width: 280px;' : ''"
      @click="router.push(`/training/videos/${video.id}`)"
    >
      <div class="relative aspect-video bg-gray-200 overflow-hidden">
        <img
          :src="video.thumbnailUrl"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
        >
          {{ formatDuration(video.durationSec) }}
        </div>
        <div
          class="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-white bg-[#8A8F6E]"
        >
          {{ video.level }}
        </div>
      </div>

      <div class="p-4">
        <h3
          class="text-sm font-bold text-gray-800 line-clamp-2 mb-3 h-10 leading-5"
        >
          {{ video.title }}
        </h3>

        <div class="flex justify-between items-end mt-auto">
          <span
            class="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-[11px] rounded-md font-medium"
          >
            #
            {{
              CATEGORY_MODE[video.mainCategory] || video.mainCategory || '전체'
            }}
          </span>

          <div v-if="showActions" class="flex items-center gap-2">
            <button
              @click.stop="handleLike(video.id)"
              class="flex items-center gap-1 rounded-lg hover:bg-red-50 transition-colors group/like"
            >
              <HeartIcon
                :class="
                  video.liked
                    ? 'fill-red-400 text-red-400'
                    : 'text-gray-400 group-hover/like:text-red-400'
                "
                class="w-5 h-5 transition-colors"
              />
              <span
                :class="video.liked ? 'text-red-400' : 'text-gray-500'"
                class="text-xs font-medium text-gray-500 group-hover/like:text-red-400"
                >{{ video.likeCount }}</span
              >
            </button>

            <button
              @click.stop="handleComplete(video.id)"
              class="rounded-lg transition-all group/check"
              :class="video.isCompleted ? 'bg-green-100' : 'hover:bg-green-50'"
              title="오늘의 운동 완료"
            >
              <CheckCircleIcon
                :class="
                  video.completed || video.completedToday || video.doneBefore
                    ? 'text-green-600'
                    : 'text-gray-300 group-hover/check:text-green-500'
                "
                class="w-6 h-6 transition-colors"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTrainingStore } from '@/stores/Training';
import { HeartIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
// 실제로 좋아요/완료 여부에 따라 색을 채우고 싶다면 아래 solid 아이콘도 같이 import 하여 교체 사용 가능합니다.
// import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";
import { useRouter } from 'vue-router';
const store = useTrainingStore();

defineProps({
  videos: Array,
  isSlider: Boolean,
  showActions: {
    // 버튼 노출 여부 prop 추가
    type: Boolean,
    default: true, // 기본값은 보이게 설정
  },
});

const CATEGORY_MODE = {
  HOME: '홈트',
  YOGA: '요가',
  PILATES: '필라테스',
};

const router = useRouter();

const formatDuration = sec => {
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${min}:${s.toString().padStart(2, '0')}`;
};

// 버튼 핸들러 (부모 컴포넌트나 Store에 요청을 보내도록 emit 처리 권장)
const handleLike = async id => {
  await store.toggleVideoLike(id);
};

const handleComplete = async id => {
  await store.toggleVideoComplete(id);
};
</script>

<style scoped>
/* 추가적인 라인 클램핑이 필요할 경우를 대비 (Tailwind 기본 포함 항목임) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
