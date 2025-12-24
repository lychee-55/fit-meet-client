<template>
  <div class="h-auto p-6 sm:p-6 flex justify-center bg-[#f9f9f5] min-h-screen">
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-8">
      <div class="mb-2">
        <button
          @click="goBack"
          class="flex items-center text-gray-400 hover:text-[#8A8F6E] transition font-bold text-sm"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          <span>뒤로가기</span>
        </button>
      </div>
      <div class="text-center mb-3">
        <h1 class="text-xl font-black text-gray-900">
          {{ isEditMode ? "게시글 수정" : "새 게시글 작성" }}
        </h1>
      </div>
      <hr class="border-gray-200 mb-3" />
      <HandleSubmitPostForm :mode="currentMode" :post-id="postId" />
    </div>
  </div>
</template>

<script setup>
import HandleSubmitPostForm from "@/components/community/HandleSubmitPostForm.vue";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

// URL 파라미터 :method (create 또는 edit)
const currentMode = computed(() => route.params.method);

// URL 파라미터 :id (수정 시에만 존재)
const postId = computed(() => route.params.id);
// const postId = computed(() => {
//   const id = route.params.id;
//   return id ? Number(id) : null; // 혹은 Number(id)
// });

const isEditMode = computed(() => currentMode.value === "edit");

const goBack = () => {
  router.back();
};
</script>
