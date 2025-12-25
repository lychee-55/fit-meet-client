<template>
  <div
    @click="$emit('open-detail', post.id)"
    class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start mb-3">
      <div class="flex gap-3">
        <img
          :src="post.writerProfileImageUrl || '@/assets/profile.jpg'"
          class="w-12 h-12 rounded-full object-cover shadow-sm"
        />
        <div>
          <h4 class="font-bold text-gray-900 leading-tight">
            {{ post.writerNickname }}
          </h4>
          <span class="text-xs text-gray-400">{{
            formatDate(post.createdAt)
          }}</span>
        </div>
      </div>
      <div class="flex gap-1 flex-wrap justify-end max-w-[40%]">
        <span
          v-for="tag in post.tags.slice(0, isMobile ? 2 : 3)"
          :key="tag"
          class="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <div class="mb-4">
      <h3 class="font-bold text-lg mb-1 text-gray-800">{{ post.title }}</h3>
      <p class="text-sm text-gray-600 line-clamp-3 mb-3">
        {{ post.contentPreview }}
      </p>
      <img
        v-if="post.postImageUrl"
        :src="post.postImageUrl"
        class="w-full h-64 object-cover rounded-xl border border-gray-50"
      />
    </div>

    <div class="flex justify-between items-center pt-3 border-t border-gray-50">
      <div class="flex gap-4">
        <button
          @click.stop="store.toggleLike(post.id, post.likedByMe)"
          class="flex items-center gap-1.5 group"
        >
          <HeartIcon
            :class="
              post.likedByMe
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 group-hover:text-red-400'
            "
            class="w-5 h-5 transition-colors"
          />
          <span class="text-sm font-medium">{{ post.likeCount }}</span>
        </button>

        <button
          @click.stop="toggleComments"
          class="flex items-center gap-1.5 group"
        >
          <ChatBubbleLeftIcon
            class="w-5 h-5 text-gray-400 group-hover:text-blue-400"
          />
          <span class="text-sm font-medium">{{ post.commentCount }}</span>
        </button>
      </div>

      <div class="text-xs text-gray-400 flex items-center gap-1">
        <EyeIcon class="w-4 h-4" /> {{ post.viewCount }}
      </div>
    </div>

    <div v-if="showComments" @click.stop class="mt-4">
      <CommentSection :postId="post.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCommunityStore } from '@/stores/Community';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
} from '@heroicons/vue/24/outline';
import CommentSection from './CommentSection.vue';

// defineProps와 defineEmits 정의
const props = defineProps(['post']);
const emit = defineEmits(['open-detail']);

const store = useCommunityStore();
const showComments = ref(false);

const isMobile = computed(() => window.innerWidth < 640);
const toggleComments = () => (showComments.value = !showComments.value);
const formatDate = date => new Date(date).toLocaleDateString();
</script>
