<template>
  <div class="comment-section mt-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <ChatBubbleLeftRightIcon class="w-7 h-7 text-[#8A8F6E]" />
      댓글 <span class="text-[#8A8F6E]">{{ comments?.length || 0 }}</span>
    </h2>

    <div
      class="bg-white p-4 rounded-2xl border border-gray-200 mb-6 focus-within:border-[#8A8F6E] transition-all shadow-sm"
    >
      <textarea
        v-model="newComment"
        placeholder="따뜻한 응원의 댓글을 남겨주세요."
        class="w-full p-2 outline-none resize-none text-gray-600 h-12 placeholder:text-gray-300"
      ></textarea>
      <div class="flex justify-end mt-2">
        <button
          @click="submitComment"
          :disabled="!newComment.trim()"
          class="px-6 py-2 bg-[#8A8F6E] text-white rounded-xl font-bold hover:bg-[#767a5d] transition disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          댓글 등록
        </button>
      </div>
    </div>

    <div v-if="comments && comments.length > 0" class="space-y-0">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="group flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <div
          class="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[#8A8F6E] font-bold"
        >
          {{ comment.nickname?.substring(0, 1) || "U" }}
        </div>

        <div class="flex-1">
          <div class="flex justify-between items-start mb-1">
            <div>
              <span class="font-bold text-gray-800 mr-2">{{
                comment.nickname
              }}</span>
              <span class="text-xs text-gray-400">{{
                comment.createdAt.replace("T", " ")
              }}</span>
            </div>
          </div>
          <p class="text-gray-600 leading-relaxed text-sm">
            {{ comment.content }}
          </p>
        </div>
        <button
          @click="onDelete(comment.id)"
          class="text-gray-300 hover:text-red-400 transition-opacity opacity-0 group-hover:opacity-100"
          title="댓글 삭제"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400"
    >
      <ChatBubbleOvalLeftIcon class="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p>첫 번째 댓글을 남겨보세요!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  comments: Array,
  videoId: [String, Number],
});

const emit = defineEmits(["submit", "delete"]);
const newComment = ref("");

const submitComment = () => {
  if (!newComment.value.trim()) return;
  emit("submit", newComment.value);
  newComment.value = ""; // 초기화
};

const onDelete = (commentId) => {
  if (confirm("댓글을 삭제하시겠습니까?")) {
    emit("delete", commentId);
  }
};
</script>
