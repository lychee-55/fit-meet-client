<template>
  <div class="max-w-4xl mx-auto px-4 py-8 pb-24">
    <div
      class="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8"
    >
      <div class="flex flex-col md:flex-row items-center gap-6">
        <img
          :src="authStore.userInfo.profileImageUrl || '@/assets/profile.png'"
          class="w-24 h-24 rounded-full object-cover border-4 border-[#8A8F6E]/10 shadow-sm"
        />
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            {{ authStore.userInfo.nickname }}
          </h2>
          <div class="flex justify-center md:justify-start gap-8">
            <div class="text-center">
              <p class="text-xs text-gray-400 mb-1">작성글</p>
              <p class="text-lg font-black text-gray-800">
                {{ myPosts.length }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-400 mb-1">좋아요한 글</p>
              <p class="text-lg font-black text-gray-800">
                {{ likedPosts.length }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-400 mb-1">받은 좋아요</p>
              <p class="text-lg font-black text-red-500">
                {{ totalReceivedLikes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-4 mb-6 border-b border-gray-100">
      <button
        @click="handleTabChange('my')"
        :class="
          currentTab === 'my'
            ? 'text-gray-900 border-b-2 border-[#8A8F6E]'
            : 'text-gray-400'
        "
        class="pb-3 px-2 font-bold transition-all"
      >
        내 게시글
      </button>
      <button
        @click="handleTabChange('liked')"
        :class="
          currentTab === 'liked'
            ? 'text-gray-900 border-b-2 border-[#8A8F6E]'
            : 'text-gray-400'
        "
        class="pb-3 px-2 font-bold transition-all"
      >
        좋아요한 글
      </button>
    </div>

    <div
      v-if="displayPosts.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      <div
        v-for="post in displayPosts"
        :key="post.id"
        class="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
        @click="handleOpenDetail(post.id)"
      >
        <img
          v-if="post.postImageUrl"
          :src="post.postImageUrl"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div
          v-else
          class="p-4 h-full flex items-center justify-center text-center bg-white"
        >
          <p class="text-xs text-gray-500 line-clamp-4 leading-relaxed">
            {{ post.contentPreview }}
          </p>
        </div>

        <div
          v-if="currentTab === 'my'"
          class="absolute top-2 right-2 z-10"
          @click.stop
        >
          <button
            @click="activeMenuId = activeMenuId === post.id ? null : post.id"
            class="p-1.5 bg-black/20 backdrop-blur-md rounded-lg text-white hover:bg-black/40 transition-colors"
          >
            <EllipsisVerticalIcon class="w-5 h-5" />
          </button>

          <transition name="fade">
            <div
              v-if="activeMenuId === post.id"
              class="absolute right-0 mt-2 w-24 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <button
                @click="handleEdit(post.id)"
                class="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <PencilIcon class="w-3.5 h-3.5" /> 수정
              </button>
              <button
                @click="handleDelete(post.id)"
                class="w-full px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <TrashIcon class="w-3.5 h-3.5" /> 삭제
              </button>
            </div>
          </transition>
        </div>

        <div
          class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm"
        >
          <span class="flex items-center gap-1"
            ><HeartIcon class="w-4 h-4 fill-white" /> {{ post.likeCount }}</span
          >
          <span class="flex items-center gap-1"
            ><ChatBubbleLeftIcon class="w-4 h-4 fill-white" />
            {{ post.commentCount }}</span
          >
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-24 bg-white rounded-[32px] border border-dashed border-gray-200"
    >
      <p class="text-gray-400">게시글이 아직 없습니다.</p>
    </div>

    <PostItemDetailModal
      v-if="isModalOpen"
      :post-id="selectedPostId"
      @close="isModalOpen = false"
    />
  </div>
  <NavBar />
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia"; // 반응성 유지를 위해 필요
import { useCommunityStore } from "@/stores/Community";
import { useAuthStore } from "@/stores/Auth";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/vue/24/solid";
import PostItemDetailModal from "@/components/community/PostItemDetailModal.vue";
import NavBar from "@/components/community/NavBar.vue";

const store = useCommunityStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { myPosts, likedPosts, isLoading } = storeToRefs(store);

const currentTab = ref("my");
const activeMenuId = ref(null);
const isModalOpen = ref(false);
const selectedPostId = ref(null);

// 받은 총 좋아요 수 계산
const totalReceivedLikes = computed(() => {
  return myPosts.value.reduce((acc, cur) => acc + (cur.likeCount || 0), 0);
});

// 현재 탭에 따른 리스트 노출
const displayPosts = computed(() => {
  return currentTab.value === "my" ? myPosts.value : likedPosts.value;
});

// 데이터 호출 및 탭 설정
const initData = async () => {
  updateTabFromQuery();
  // 두 데이터를 동시에 호출하여 성능 최적화
  await Promise.all([store.fetchMyPosts(), store.fetchLikedPosts()]);
};

onMounted(() => {
  initData();
});

// URL 쿼리 감시
watch(
  () => route.query.tab,
  () => {
    updateTabFromQuery();
  }
);

const updateTabFromQuery = () => {
  const tab = route.query.tab;
  currentTab.value = tab === "liked" ? "liked" : "my";
};

const handleTabChange = (tabName) => {
  const tabQuery = tabName === "my" ? "myposts" : "liked";
  router.push({ query: { tab: tabQuery } });
};

// 삭제 핸들러 (Store의 액션 사용)
const handleDelete = async (id) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    const success = await store.deletePost(id);
    if (success) alert("삭제되었습니다.");
  }
  activeMenuId.value = null;
};

const handleEdit = (postId) => {
  // 방법 1: Params 방식 (권장)
  router.push(`/community/form/edit/${postId}`);

  // 방법 2: Query 방식 (만약 라우트를 따로 안 만들었다면)
  // router.push(`/community/write?mode=edit&id=${postId}`);
};

// 상세 모달 열기
const handleOpenDetail = (id) => {
  selectedPostId.value = id;
  isModalOpen.value = true;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
