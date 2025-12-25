<template>
  <div class="comment-section">
    <div v-if="mode !== 'input-only'" class="space-y-4">
      <div
        v-for="comment in formattedComments"
        :key="comment.id"
        class="space-y-3"
      >
        <div class="flex gap-3">
          <img
            :src="comment.writerProfileImageUrl || '@/assets/profile.jpg'"
            class="w-8 h-8 rounded-full shadow-sm object-cover"
          />
          <div class="flex-1">
            <div class="bg-gray-50 p-3 rounded-2xl relative group">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-bold text-gray-700">{{
                  comment.writerNickname
                }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-gray-400">{{
                    formatTime(comment.createdAt)
                  }}</span>
                  <button
                    v-if="
                      authStore.userInfo?.nickname === comment.writerNickname
                    "
                    @click="handleDelete(comment.id)"
                    class="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:font-bold"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600">{{ comment.content }}</p>
            </div>
            <button
              @click="handleReplyClick(comment)"
              class="text-[10px] text-gray-500 mt-1 ml-2 hover:text-[#8A8F6E] transition-colors"
            >
              답글 달기
            </button>
          </div>
        </div>

        <div v-if="comment.children?.length" class="ml-6 space-y-3">
          <div
            v-for="reply in comment.children"
            :key="reply.id"
            class="flex gap-2"
          >
            <div class="mt-2 text-gray-300 flex-shrink-0">
              <ArrowTurnDownRightIcon class="w-4 h-4" />
            </div>
            <div class="flex gap-3 flex-1">
              <img
                :src="reply.writerProfileImageUrl || '@/assets/profile.jpg'"
                class="w-6 h-6 rounded-full shadow-sm object-cover"
              />
              <div
                class="flex-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100/50 relative group"
              >
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-bold text-gray-700">{{
                    reply.writerNickname
                  }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-gray-400">{{
                      formatTime(reply.createdAt)
                    }}</span>
                    <button
                      v-if="
                        authStore.userInfo?.nickname === reply.writerNickname
                      "
                      @click="handleDelete(reply.id)"
                      class="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:font-bold"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="mode !== 'list-only'"
      class="relative flex items-end gap-2"
      :class="{ 'mt-6': !mode }"
    >
      <img
        :src="authStore.userInfo?.profileImageUrl || '@/assets/profile.jpg'"
        class="w-8 h-8 rounded-full mb-1 shadow-sm object-cover"
      />
      <div class="flex-1 relative group">
        <div
          v-if="replyingTo"
          id="reply-badge"
          class="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-600 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 z-10"
        >
          <span class="font-medium">@{{ replyingTo.writerNickname }}</span>
          <button
            @click="cancelReply"
            class="hover:text-red-500 font-bold ml-1"
          >
            ×
          </button>
        </div>

        <input
          ref="commentInput"
          v-model="newComment"
          @keyup.enter="handleCommentSubmit"
          :style="{ paddingLeft: replyingTo ? badgeWidth + 'px' : '1rem' }"
          :placeholder="replyingTo ? '' : '댓글을 입력하세요...'"
          class="w-full bg-gray-100 border-none rounded-2xl py-2.5 pr-10 text-sm focus:ring-2 focus:ring-[#8A8F6E]/20 outline-none transition-all"
        />

        <button
          @click="handleCommentSubmit"
          :class="newComment.trim() ? 'text-[#8A8F6E]' : 'text-gray-300'"
          class="absolute right-2 bottom-1.5 p-1 transition-all"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useCommunityStore } from '@/stores/Community';
import { useAuthStore } from '@/stores/Auth';
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid';
import { ArrowTurnDownRightIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['postId', 'mode']);
const emit = defineEmits(['comment-success', 'reply-request']);

const store = useCommunityStore();
const authStore = useAuthStore();

const newComment = ref('');
const replyingTo = ref(null);
const badgeWidth = ref(0);
const rawComments = ref([]);
const commentInput = ref(null);

watch(replyingTo, async newVal => {
  if (newVal) {
    await nextTick();
    const badge = document.getElementById('reply-badge');
    if (badge) badgeWidth.value = badge.offsetWidth + 16;
  } else {
    badgeWidth.value = 0;
  }
});

// 핵심: 답글 버튼 클릭 시 동작
const handleReplyClick = comment => {
  // 1. 단일 모드(PostItem)일 경우: 직접 내부 상태 변경
  if (!props.mode) {
    replyingTo.value = comment;
    nextTick(() => commentInput.value?.focus());
  }
  // 2. 분리 모드(Modal)일 경우: 부모에게 알려서 입력창 컴포넌트로 전달하게 함
  emit('reply-request', comment);
};

const loadComments = async () => {
  const result = await store.fetchComments(props.postId);
  rawComments.value = result || [];
};

// 모달에서 하단 입력창을 강제 제어할 때 사용
const setReplyExternally = comment => {
  replyingTo.value = comment;
  nextTick(() => commentInput.value?.focus());
};

const cancelReply = () => {
  replyingTo.value = null;
};

const handleCommentSubmit = async () => {
  if (!newComment.value.trim()) return;
  const parentId = replyingTo.value ? replyingTo.value.id : 0;
  const result = await store.addComment(
    props.postId,
    newComment.value,
    parentId,
  );
  if (result) {
    newComment.value = '';
    replyingTo.value = null;
    emit('comment-success');
    await loadComments();
  }
};

const handleDelete = async commentId => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return;
  await store.deleteComment(props.postId, commentId);
  emit('comment-success');
  await loadComments();
};

const formattedComments = computed(() => {
  const map = {};
  const roots = [];
  rawComments.value.forEach(c => (map[c.id] = { ...c, children: [] }));
  rawComments.value.forEach(c => {
    if (c.parentId && map[c.parentId]) map[c.parentId].children.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
});

const formatTime = date => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

defineExpose({ loadComments, setReplyExternally });
onMounted(loadComments);
</script>
