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
              @keyup.enter="store.fetchPosts()"
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
            <PostItem v-for="post in store.posts" :key="post.id" :post="post" />
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
                @click="store.filters.tag = tag"
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
        </aside>
      </div>
    </div>
  </div>
  <NavBar />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCommunityStore } from '@/stores/Community';
import { MagnifyingGlassIcon, HashtagIcon } from '@heroicons/vue/24/outline';
import PostItem from '@/components/community/PostItem.vue';
import GoToTopBtn from '@/components/common/GoToTopBtn.vue';
import NavBar from '@/components/community/NavBar.vue';

const store = useCommunityStore();
const isHeaderVisible = ref(true);
let lastScrollPosition = 0;

const handleScroll = () => {
  const currentScroll = window.scrollY;

  if (currentScroll < 50) {
    isHeaderVisible.value = true;
  } else {
    isHeaderVisible.value = currentScroll < lastScrollPosition;
  }
  lastScrollPosition = currentScroll;
};

onMounted(() => {
  store.fetchPosts();
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
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
