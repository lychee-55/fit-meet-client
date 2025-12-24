<template>
  <div class="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
    <h2 class="text-xl font-bold text-gray-800 mb-4">전체 운동 영상</h2>

    <div class="flex flex-col gap-4 mb-4">
      <div class="flex gap-6 border-b border-gray-200">
        <button
          v-for="cat in [
            { id: '', n: '전체' },
            { id: 'YOGA', n: '요가' },
            { id: 'PILATES', n: '필라테스' },
            { id: 'HOME', n: '홈트' },
          ]"
          :key="cat.id"
          @click="updateFilter('category', cat.id)"
          class="pb-3 px-1 text-sm font-bold transition-all relative"
          :class="
            store.filters.category === cat.id
              ? 'text-[#8A8F6E]'
              : 'text-gray-400'
          "
        >
          {{ cat.n }}
          <div
            v-if="store.filters.category === cat.id"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-[#8A8F6E]"
          ></div>
        </button>
      </div>

      <div class="flex flex-wrap justify-between gap-4 items-center text-sm">
        <div class="flex gap-2">
          <select
            v-model="store.filters.level"
            @change="store.fetchVideos()"
            class="bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none"
          >
            <option value="">전체 레벨</option>
            <option value="BEGINNER">초보자</option>
            <!-- <option value="INTERMEDIATE">중급자</option> -->
          </select>

          <select
            v-model="store.filters.shortVideo"
            @change="store.fetchVideos()"
            class="bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none"
          >
            <option :value="null">전체 시간</option>
            <option :value="true">15분 이내</option>
            <option :value="false">15분 이상</option>
          </select>

          <select
            v-model="store.filters.sort"
            @change="store.fetchVideos()"
            class="bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none"
          >
            <option value="LATEST">최신순</option>
            <option value="POPULAR">인기순</option>
            <option value="OLDEST">오래된순</option>
          </select>
        </div>

        <div>
          <!-- <span class="text-gray-400"
            >총 {{ store.videos.length }}개의 영상</span
          > -->
          <span class="text-gray-400">총 60개의 영상</span>
        </div>
      </div>
    </div>

    <!-- <div v-if="store.loading" class="py-20 text-center text-gray-500">
      영상을 불러오는 중입니다...
    </div> -->

    <div class="relative min-h-[400px]">
      <div
        :class="{ 'opacity-40 pointer-events-none': store.loading }"
        class="transition-opacity duration-300"
      >
        <div
          v-if="store.videos.length === 0 && !store.loading"
          class="py-20 text-center text-gray-400"
        >
          조건에 맞는 영상이 없습니다.
        </div>
        <div v-else>
          <VideoCardList
            :videos="store.videos"
            :is-slider="false"
            :show-actions="true"
          />
          <div
            v-if="store.totalPages > 0"
            class="flex justify-center items-center gap-2 mt-10"
          >
            <button
              @click="store.setPage(store.filters.page - 1)"
              :disabled="store.filters.page === 0"
              class="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
            </button>

            <button
              v-for="p in store.totalPages"
              :key="p"
              @click="store.setPage(p - 1)"
              :class="[
                'px-4 py-2 rounded-md border text-sm font-medium transition-all',
                store.filters.page === p - 1
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-500',
              ]"
            >
              {{ p }}
            </button>

            <button
              @click="store.setPage(store.filters.page + 1)"
              :disabled="store.filters.page >= store.totalPages - 1"
              class="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="store.loading"
        class="absolute inset-0 flex flex-col justify-center items-center bg-white/10 backdrop-blur-[1px] z-10"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8A8F6E]"
        ></div>
        <p class="mt-2 text-sm text-[#8A8F6E] font-medium">데이터 갱신 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useTrainingStore } from "@/stores/Training";
import VideoCardList from "./VideoCardList.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const store = useTrainingStore();

onMounted(() => {
  store.fetchVideos();
});

const updateFilter = (key, val) => {
  store.filters[key] = val;
  store.filters.page = 0;
  store.fetchVideos();
};
</script>
