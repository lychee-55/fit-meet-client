<template>
  <div class="min-h-screen pb-20">
    <!-- bg-[#F8F9FA] -->
    <transition name="header-slide">
      <div
        v-show="isHeaderVisible"
        class="fixed top-17 left-0 right-0 bg-white backdrop-blur-sm border-b border-gray-100 z-60 py-5 shadow-sm"
      >
        <div
          class="max-w-6xl mx-auto px-4 flex items-center justify-center gap-10"
        >
          <div class="hidden flex-col items-start shrink-0 lg:block">
            <h2 class="text-lg font-black text-gray-900">전체검색</h2>
            <span
              class="text-[10px] font-bold text-[#8A8F6E] uppercase tracking-widest"
              >Fitmeet Community</span
            >
          </div>

          <div class="relative w-full max-w-2xl">
            <input
              v-model="store.filters.keyword"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="관심있는 키워드를 입력해보세요"
              class="w-full bg-gray-50 border-gray-200 border rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#8A8F6E] focus:bg-white transition-all shadow-inner"
            />
            <MagnifyingGlassIcon
              class="w-5 h-5 absolute left-4 top-3.5 text-gray-400"
            />
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <GoToTopBtn />
    </transition>

    <div class="max-w-7xl mx-auto px-4 pt-30 py-8">
      <div
        class="grid grid-cols-1 lg:grid-cols-[1fr_720px_1fr] gap-8 items-start"
      >
        <div class="hidden lg:block"></div>

        <main class="space-y-8 order-2 lg:order-0">
          <div
            class="flex gap-6 border-b border-gray-200 justify-center lg:justify-start"
          >
            <button
              v-for="s in [
                { id: 'POPULAR', n: '인기 피드' },
                { id: 'LATEST', n: '최신순' },
                { id: 'OLDEST', n: '오래된순' },
              ]"
              :key="s.id"
              @click="
                store.filters.sort = s.id;
                store.fetchPosts();
              "
              class="pb-2 px-1 text-sm font-bold transition-all relative"
              :class="
                store.filters.sort === s.id ? 'text-[#8A8F6E]' : 'text-gray-400'
              "
            >
              {{ s.n }}
              <div
                v-if="store.filters.sort === s.id"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-[#8A8F6E]"
              ></div>
            </button>
          </div>

          <div class="flex flex-col gap-8" v-if="store.posts.length > 0">
            <PostItem
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @open-detail="handleOpenDetail"
            />
            <!-- 페이지 무한스크롤링 -->
            <div
              ref="loadMoreTrigger"
              class="h-20 flex items-center justify-center"
            >
              <div v-if="store.loading" class="flex gap-2">
                <span
                  class="w-2 h-2 bg-[#8A8F6E] rounded-full animate-bounce"
                ></span>
                <span
                  class="w-2 h-2 bg-[#8A8F6E] rounded-full animate-bounce [animation-delay:-0.15s]"
                ></span>
                <span
                  class="w-2 h-2 bg-[#8A8F6E] rounded-full animate-bounce [animation-delay:-0.3s]"
                ></span>
              </div>
              <p
                v-else-if="!store.hasNext && posts.length > 0"
                class="text-xs text-gray-400"
              >
                마지막 게시글입니다.
              </p>
            </div>
          </div>

          <div
            v-else
            class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
          >
            <p class="text-gray-400">게시글이 없습니다.</p>
          </div>
        </main>

        <aside class="w-full lg:w-54 space-y-6 order-1 lg:order-0">
          <div
            class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 sticky top-48"
          >
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HashtagIcon class="w-5 h-5 text-[#8A8F6E]" /> 인기 태그
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in store.allTags"
                :key="tag"
                @click="handleTagClick(tag)"
                class="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                :class="
                  store.filters.tag === tag
                    ? 'bg-[#8A8F6E] text-white shadow-md'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                "
              >
                #{{ tag }}
              </button>
            </div>
          </div>
          <div
            class="bg-white rounded-[24px] shadow-sm border border-gray-100 sticky top-48 overflow-hidden"
          >
            <router-link to="/community/my-page?tab=myposts">
              <div class="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <h3
                  class="font-bold text-gray-900 flex items-center gap-2 text-sm"
                >
                  <UserCircleIcon class="w-5 h-5 text-[#8A8F6E]" />
                  나의 커뮤니티
                </h3>
              </div>
            </router-link>

            <div class="p-2">
              <router-link
                to="/community/my-page?tab=myposts"
                class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#8A8F6E]/5 group transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors"
                  >
                    <PencilSquareIcon class="w-4 h-4 text-blue-500" />
                  </div>
                  <span
                    class="text-xs font-semibold text-gray-700 group-hover:text-gray-900"
                    >내가 작성한 게시글</span
                  >
                </div>
                <ChevronRightIcon
                  class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-transform group-hover:translate-x-1"
                />
              </router-link>
              <router-link
                to="/community/my-page?tab=liked"
                class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#8A8F6E]/5 group transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors"
                  >
                    <HeartIcon class="w-4 h-4 text-red-500" />
                  </div>
                  <span
                    class="text-xs font-semibold text-gray-700 group-hover:text-gray-900"
                    >내가 좋아요한 게시글</span
                  >
                </div>
                <ChevronRightIcon
                  class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-transform group-hover:translate-x-1"
                />
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
  <PostItemDetailModal
    v-if="isModalOpen"
    :post-id="selectedPostId"
    @close="handleCloseModal"
  />
  <NavBar />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useCommunityStore } from "@/stores/Community";
import {
  MagnifyingGlassIcon,
  HashtagIcon,
  UserCircleIcon,
  ArrowUpRightIcon,
} from "@heroicons/vue/24/outline";
import PostItem from "@/components/community/PostItem.vue";
import GoToTopBtn from "@/components/common/GoToTopBtn.vue";
import NavBar from "@/components/community/NavBar.vue";
import PostItemDetailModal from "@/components/community/PostItemDetailModal.vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

const store = useCommunityStore();
const route = useRoute();
const router = useRouter();
const { posts } = storeToRefs(store);
const isHeaderVisible = ref(true);
let lastScrollPosition = 0;
const isModalOpen = ref(false);
const selectedPostId = ref(null);

const handleOpenDetail = (id) => {
  router.push(`/community/post/${id}`);
  // push를 하면 URL이 바뀌고, 아래 watch가 이를 감지해서 모달을 엽니다.
};

// 2. 모달을 닫을 때 URL을 다시 원래대로 (/community) 변경
const handleCloseModal = () => {
  router.push("/community");
  // 혹은 router.back() 을 써도 되지만, 안전하게 목록 주소를 쓰는 것이 좋습니다.
};

// 3. 핵심: URL의 변화를 감시해서 모달을 열고 닫음
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      selectedPostId.value = newId;
      isModalOpen.value = true;
    } else {
      selectedPostId.value = null;
      isModalOpen.value = false;
    }
  },
  { immediate: true } // 페이지 진입 시 URL에 id가 있다면 바로 모달을 띄움
);

const handleScroll = () => {
  const currentScroll = window.scrollY;

  if (currentScroll < 50) {
    isHeaderVisible.value = true;
  } else {
    isHeaderVisible.value = currentScroll < lastScrollPosition;
  }
  lastScrollPosition = currentScroll;
};

//무한스크롤링 구현로직
const loadMoreTrigger = ref(null);
let observer = null;

const initObserver = () => {
  // 이미 생성된 관찰자가 있다면 제거
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    async (entries) => {
      // 1. 요소가 화면에 보이고 2. 로딩 중이 아니며 3. 다음 페이지가 있을 때만 요청
      if (entries[0].isIntersecting && !store.loading && store.hasNext) {
        await store.fetchPosts(false); // 기존 데이터 뒤에 추가
      }
    },
    { threshold: 0.1 }
  );

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value);
};

// 정렬이나 검색 시에는 리스트를 리셋해야 함
const handleSearch = async () => {
  await store.fetchPosts(true);
};

onMounted(async () => {
  await store.fetchPosts(true); // 첫 로딩 시 리셋 모드
  await store.fetchTopTags();
  initObserver(); // 관찰 시작
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (observer) observer.disconnect();
});
// onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style scoped>
.header-slide-enter-active,
.header-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.header-slide-enter-from,
.header-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
