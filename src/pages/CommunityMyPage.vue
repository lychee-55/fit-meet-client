<template>
  <div class="max-w-4xl mx-auto px-4 py-8 pb-24">
    <div
      class="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8"
    >
      <div class="flex flex-col md:flex-row items-center gap-6">
        <img
          :src="authStore.userInfo.profileImageUrl || '@/assets/profile.jpg'"
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

    <div
      class="flex items-center justify-between mb-6 border-b border-gray-100"
    >
      <div class="flex gap-4 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          :class="[
            currentTab === tab.id
              ? 'text-gray-900 border-b-2 border-[#8A8F6E]'
              : 'text-gray-400',
            'pb-3 px-2 font-bold transition-all whitespace-nowrap',
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.id === 'deleted'"
            class="ml-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full"
          >
            {{ (deletedPosts || []).length }}
          </span>
        </button>
      </div>

      <button
        v-if="currentTab !== 'liked'"
        @click="isEditMode = !isEditMode"
        class="mb-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
        :class="
          isEditMode
            ? 'bg-[#8A8F6E] text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        "
      >
        {{ isEditMode ? '완료' : '편집' }}
      </button>
    </div>

    <div
      v-if="displayPosts.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 gap-6"
    >
      <div
        v-for="post in displayPosts"
        :key="post.id"
        class="flex flex-col group"
      >
        <div
          class="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer shadow-sm"
          @click="handleOpenDetail(post.id)"
        >
          <img
            v-if="post.postImageUrl"
            :src="post.postImageUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            :class="{ 'grayscale opacity-60': currentTab === 'deleted' }"
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
            class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm"
          >
            <span class="flex items-center gap-1"
              ><HeartIcon class="w-4 h-4 fill-white" />
              {{ post.likeCount }}</span
            >
            <span class="flex items-center gap-1"
              ><ChatBubbleLeftIcon class="w-4 h-4 fill-white" />
              {{ post.commentCount }}</span
            >
          </div>
        </div>

        <transition name="slide-up">
          <div v-if="isEditMode" class="mt-2 flex gap-1 animate-fade-in">
            <template v-if="currentTab === 'my'">
              <button
                @click.stop="handleEdit(post.id)"
                class="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 hover:bg-gray-50"
              >
                수정
              </button>
              <button
                @click.stop="handleDelete(post.id)"
                class="flex-1 py-2 bg-white border border-red-100 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-50"
              >
                삭제
              </button>
            </template>

            <template v-else-if="currentTab === 'deleted'">
              <button
                @click.stop="handleRestore(post.id)"
                class="flex-1 py-2 bg-[#8A8F6E] rounded-xl text-[11px] font-bold text-white hover:bg-[#7a7f62]"
              >
                복원하기
              </button>
            </template>
          </div>
        </transition>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCommunityStore } from '@/stores/Community';
import { useAuthStore } from '@/stores/Auth';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/vue/24/solid';
import PostItemDetailModal from '@/components/community/PostItemDetailModal.vue';
import NavBar from '@/components/community/NavBar.vue';

const store = useCommunityStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { myPosts, likedPosts, deletedPosts } = storeToRefs(store);

const currentTab = ref('my');
const isEditMode = ref(false); // [추가] 편집 모드 상태
const isModalOpen = ref(false);
const selectedPostId = ref(null);

const tabs = [
  { id: 'my', label: '내 게시글' },
  { id: 'liked', label: '좋아요한 글' },
  { id: 'deleted', label: '휴지통' },
];

const totalReceivedLikes = computed(() => {
  return (myPosts.value || []).reduce(
    (acc, cur) => acc + (cur.likeCount || 0),
    0,
  );
});

const displayPosts = computed(() => {
  if (currentTab.value === 'liked') return likedPosts.value || [];
  if (currentTab.value === 'deleted') return deletedPosts.value || [];
  return myPosts.value || [];
});

const initData = async () => {
  updateTabFromQuery();
  await Promise.all([
    store.fetchMyPosts(),
    store.fetchLikedPosts(),
    store.fetchDeletedPosts(),
  ]);
};

onMounted(initData);

// 탭 변경 시 편집 모드 자동 해제
watch(
  () => currentTab.value,
  () => {
    isEditMode.value = false;
  },
);

watch(
  () => route.query.tab,
  () => {
    updateTabFromQuery();
  },
);

const updateTabFromQuery = () => {
  const tab = route.query.tab;
  if (tab === 'liked') currentTab.value = 'liked';
  else if (tab === 'deleted') currentTab.value = 'deleted';
  else currentTab.value = 'my';
};

const handleTabChange = tabId => {
  router.push({ query: { tab: tabId } });
};

// 게시글 삭제 (소프트 삭제)
const handleDelete = async id => {
  if (confirm('정말 삭제하시겠습니까?')) {
    const success = await store.deletePost(id);
    if (success) {
      alert('삭제되었습니다.');
      await store.fetchDeletedPosts(); // 휴지통 갱신
    }
  }
};

// 게시글 복원
const handleRestore = async id => {
  if (confirm('이 게시글을 복원하시겠습니까?')) {
    try {
      const response = await store.restorePost(id);
      if (response.code === 0) {
        alert('게시글이 성공적으로 복원되었습니다.');
      }
    } catch (error) {
      alert('복원 실패: 다시 시도해 주세요.');
    }
  }
};

const handleEdit = postId => {
  router.push(`/community/form/edit/${postId}`);
};

const handleOpenDetail = id => {
  selectedPostId.value = id;
  isModalOpen.value = true;
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
