<template>
  <div class="mt-4 pt-4 border-t border-gray-50 space-y-4">
    <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
      <img :src="comment.writerProfileImageUrl" class="w-8 h-8 rounded-full" />
      <div class="flex-1 bg-gray-50 p-3 rounded-2xl relative">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-gray-700">{{
            comment.writerNickname
          }}</span>
          <span class="text-[10px] text-gray-400">{{
            formatDate(comment.createdAt)
          }}</span>
        </div>
        <p class="text-sm text-gray-600">{{ comment.content }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-4">
      <img src="@/assets/profile.png" class="w-8 h-8 rounded-full" />
      <div class="flex-1 relative">
        <input
          v-model="newComment"
          @keyup.enter="handleCommentSubmit"
          placeholder="댓글을 입력하세요..."
          class="w-full bg-gray-100 border-none rounded-full py-2 px-4 text-sm focus:ring-1 focus:ring-[#8A8F6E]"
        />
        <button
          @click="handleCommentSubmit"
          class="absolute right-2 top-1.5 p-1 text-[#8A8F6E] hover:scale-110 transition"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCommunityStore } from '@/stores/Community';
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid';

const props = defineProps(['postId']);
const store = useCommunityStore();
const comments = ref([]);
const newComment = ref('');

const loadComments = async () => {
  const result = await store.fetchComments(props.postId);
  // 2. 결과가 없으면 빈 배열([])을 넣도록 강제 (Null check)
  comments.value = result || [];
};

const handleCommentSubmit = async () => {
  if (!newComment.value.trim()) return;
  // const result = await store.addComment(props.postId, newComment.value);
  // if (result) {
  //   comments.value.push(result);
  //   newComment.value = '';
  // }
  // 실제 백엔드 연결 전이라면 아래처럼 로컬에 바로 추가해서 테스트 가능
  if (!comments.value) {
    comments.value = [];
  }
  const mockNewComment = {
    id: Date.now(),
    writerNickname: '나(테스트)',
    content: newComment.value,
    writerProfileImageUrl: 'https://picsum.photos/100/100?random=10',
    createdAt: new Date().toISOString(),
  };
  comments.value.push(mockNewComment);
  newComment.value = '';
};

onMounted(loadComments);
const formatDate = date => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>
