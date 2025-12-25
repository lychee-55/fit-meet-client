<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative transition-all duration-300"
      :class="[
        post?.postImageUrl
          ? 'max-w-5xl h-[92vh] md:h-[90vh]'
          : 'max-w-3xl h-auto max-h-[85vh]',
      ]"
    >
      <div
        v-if="post?.postImageUrl"
        class="w-full lg:w-3/5 bg-black flex items-center justify-center relative min-h-[30vh] lg:h-full"
      >
        <img :src="post.postImageUrl" class="w-full h-full object-contain" />
        <button
          @click="$emit('close')"
          class="lg:hidden absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white backdrop-blur-md z-30"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <div
        class="flex flex-col flex-1 min-h-0 min-w-0 lg:min-w-[400px] bg-white relative"
      >
        <div
          class="shrink-0 p-4 border-b border-gray-100 flex items-center justify-between bg-white z-20"
        >
          <div class="flex items-center gap-3">
            <img
              :src="post?.writerProfileImageUrl || '@/assets/profile.jpg'"
              class="w-9 h-9 rounded-full border border-gray-100 object-cover"
            />
            <div>
              <p class="text-sm font-bold text-gray-900">
                {{ post?.writerNickname }}
              </p>
              <p class="text-[10px] text-gray-400">
                {{ formatDate(post?.createdAt) }}
              </p>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            :class="{ 'hidden lg:block': post?.postImageUrl }"
          >
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar touch-pan-y">
          <div class="p-5" v-if="post">
            <h2 class="text-lg font-black text-gray-900 mb-2">
              {{ post.title }}
            </h2>
            <p
              class="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap"
            >
              {{ post.content }}
            </p>

            <div
              v-if="hasActivity"
              class="bg-[#8A8F6E]/5 rounded-2xl p-4 mb-6 border border-[#8A8F6E]/10"
            >
              <h4
                class="text-xs font-bold text-[#8A8F6E] mb-3 flex items-center gap-1"
              >
                <SparklesIcon class="w-4 h-4" /> 오늘의 활동 요약
              </h4>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-if="post.shareDiet"
                  class="bg-white p-2 rounded-xl text-center shadow-sm"
                >
                  <p class="text-[10px] text-gray-400">칼로리</p>
                  <p class="text-xs font-bold text-gray-800">
                    {{ post.activitySummary?.todayKcal || 0 }}
                  </p>
                </div>
                <div
                  v-if="post.shareWorkout"
                  class="bg-white p-2 rounded-xl text-center shadow-sm"
                >
                  <p class="text-[10px] text-gray-400">단백질</p>
                  <p class="text-xs font-bold text-gray-800">
                    {{ post.activitySummary?.todayProtein || 0 }}g
                  </p>
                </div>
                <div
                  v-if="post.shareStreak"
                  class="bg-white p-2 rounded-xl text-center shadow-sm"
                >
                  <p class="text-[10px] text-gray-400">스트릭</p>
                  <p class="text-xs font-bold text-gray-800">
                    {{ post.activitySummary?.streakCount || 0 }}일
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="post.shareDiet && post.dietCards?.length > 0"
              class="mb-8"
            >
              <h4
                class="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2"
              >
                <CalendarIcon class="w-4 h-4 text-[#8A8F6E]" /> 상세 식단 기록
              </h4>
              <div class="space-y-3">
                <p
                  v-if="post.dietNote"
                  class="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl italic"
                >
                  " {{ post.dietNote }} "
                </p>
                <div
                  v-for="diet in post.dietCards"
                  :key="diet.dietId"
                  class="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <!-- <img
                    :src="diet.imageUrl || '/default-diet.png'"
                    class="w-14 h-14 rounded-xl object-cover bg-gray-50"
                  /> -->
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-bold text-[#8A8F6E]">
                      {{ getMealLabel(diet.mealType) }}
                    </p>
                    <p class="text-xs font-bold text-gray-800 truncate">
                      {{ diet.description || '기록된 식단' }}
                    </p>
                    <p class="text-[10px] text-gray-400">
                      {{ diet.totalKcal }}kcal | 단 {{ diet.totalProtein }}g
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="post.shareWorkout && post.workoutVideos?.length > 0"
              class="mb-8"
            >
              <h4
                class="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2"
              >
                <PlayIcon class="w-4 h-4 text-[#8A8F6E]" /> 함께 완료한 운동
              </h4>
              <div class="space-y-3">
                <p
                  v-if="post.workoutNote"
                  class="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl italic"
                >
                  " {{ post.workoutNote }} "
                </p>
                <a
                  v-for="video in post.workoutVideos"
                  :key="video.id"
                  :href="video.youtubeUrl"
                  target="_blank"
                  class="flex items-center gap-3 p-2 bg-gray-900 rounded-2xl hover:bg-black transition-colors group"
                >
                  <div class="relative w-20 h-12 shrink-0">
                    <img
                      :src="video.thumbnailUrl"
                      class="w-full h-full object-cover rounded-lg opacity-80"
                    />
                    <PlayCircleIcon
                      class="absolute inset-0 m-auto w-6 h-6 text-white/90"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-[11px] font-bold text-white truncate group-hover:text-[#D4D9A1]"
                    >
                      {{ video.title }}
                    </p>
                    <p class="text-[9px] text-gray-500">YouTube Open</p>
                  </div>
                </a>
              </div>
            </div>

            <div
              class="py-3 border-y border-gray-200 flex items-center gap-4 mb-4 sticky top-0 bg-white z-10"
            >
              <button
                @click.stop="handleLikeToggle"
                class="flex items-center gap-1.5 group"
              >
                <HeartIcon
                  :class="
                    post.likedByMe
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-300'
                  "
                  class="w-5 h-5 transition-all"
                />
                <span class="text-sm font-medium">{{ post.likeCount }}</span>
              </button>
              <div class="flex items-center gap-1.5">
                <ChatBubbleLeftIcon class="w-5 h-5 text-gray-300" />
                <span class="text-sm font-medium">{{ post.commentCount }}</span>
              </div>
            </div>

            <CommentSection
              ref="commentListRef"
              :post-id="props.postId"
              mode="list-only"
              @reply-request="handleReplyRequest"
            />
          </div>
        </div>

        <div
          class="shrink-0 p-4 mb-4 border-t border-gray-100 bg-white pb-safe"
        >
          <CommentSection
            ref="commentInputRef"
            :post-id="props.postId"
            mode="input-only"
            @comment-success="refreshAll"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCommunityStore } from '@/stores/Community';
import {
  XMarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  CalendarIcon,
  PlayIcon,
  PlayCircleIcon,
} from '@heroicons/vue/24/solid';
import CommentSection from './CommentSection.vue';

const props = defineProps({
  postId: { type: [Number, String], required: true },
});
const emit = defineEmits(['close']);
const store = useCommunityStore();
const post = ref(null);

const commentListRef = ref(null);
const commentInputRef = ref(null);

const handleReplyRequest = comment => {
  if (commentInputRef.value) {
    commentInputRef.value.setReplyExternally(comment);
  }
};

const refreshAll = async () => {
  await loadPostDetail();
  if (commentListRef.value) await commentListRef.value.loadComments();
};

const loadPostDetail = async () => {
  const data = await store.fetchPostDetail(props.postId);
  if (data) post.value = data;
};

const handleLikeToggle = async () => {
  if (!post.value) return;
  const isAdding = !post.value.likedByMe;
  post.value.likedByMe = isAdding;
  post.value.likeCount += isAdding ? 1 : -1;
  await store.toggleLike(post.value.id, !isAdding);
};

const getMealLabel = type => {
  const map = { A: '아침', B: '점심', C: '저녁', D: '간식', E: '야식' };
  return map[type] || type;
};

const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const hasActivity = computed(
  () =>
    post.value?.shareDiet ||
    post.value?.shareWorkout ||
    post.value?.shareStreak,
);

onMounted(() => {
  loadPostDetail();
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = 'auto';
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
