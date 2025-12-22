<template>
  <div class="flex flex-col gap-6">
    <div
      class="relative group w-full aspect-video rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all"
      :class="{
        'border-[#8A8F6E] bg-olive-50': isUploading || formData.imageUrl,
      }"
    >
      <label
        v-if="!formData.imageUrl && !isUploading"
        class="cursor-pointer flex flex-col items-center"
      >
        <PhotoIcon
          class="w-12 h-12 text-gray-400 group-hover:text-[#8A8F6E] transition-colors"
        />
        <span class="mt-2 text-sm font-medium text-gray-500"
          >사진을 업로드하여 분석 시작</span
        >
        <input
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleFileUpload"
        />
      </label>

      <div v-if="isUploading" class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A8F6E]"
        ></div>
        <p class="mt-4 text-sm font-bold text-[#8A8F6E] animate-pulse">
          AI가 식단을 정밀 분석 중입니다...
        </p>
      </div>

      <template v-if="formData.imageUrl && !isUploading">
        <img :src="formData.imageUrl" class="w-full h-full object-cover" />
        <button
          @click="resetImage"
          class="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </template>
    </div>

    <Transition name="fade">
      <div
        v-if="analysisResults.length > 0 && !isUploading"
        class="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
      >
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-bold text-gray-800 flex items-center gap-2 text-sm">
            <SparklesIcon class="w-4 h-4 text-amber-400" /> AI 분석 결과 추천
          </h4>
          <span class="text-[11px] text-gray-400 font-medium"
            >*키워드를 클릭하여 영양정보를 확인하세요.</span
          >
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(item, idx) in analysisResults"
            :key="idx"
            @click="applyAiKeyword(item.nameKo)"
            class="px-4 py-2 rounded-full border border-amber-100 bg-amber-50 text-amber-800 text-sm font-bold hover:bg-amber-100 hover:scale-105 transition-all active:scale-95"
          >
            {{ item.nameKo }}
          </button>
        </div>
      </div>
    </Transition>

    <div v-if="formData.foods.length > 0" class="space-y-2">
      <h4
        class="text-xs font-bold text-gray-400 uppercase tracking-tighter ml-1"
      >
        현재 등록된 식단
      </h4>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(food, index) in formData.foods"
          :key="index"
          class="flex items-center gap-2 px-3 py-1.5 bg-[#8A8F6E] text-white rounded-full text-sm shadow-sm animate-in fade-in zoom-in duration-300"
        >
          <span class="font-medium">{{ food.foodNmKr }}</span>
          <span class="opacity-80 text-xs">{{ food.intakeGram }}g</span>
          <XMarkIcon
            class="w-4 h-4 cursor-pointer hover:text-red-200"
            @click="removeFood(index)"
          />
        </div>
      </div>
    </div>

    <div v-if="formData.imageUrl && !isUploading" class="mt-2">
      <div
        v-if="!showManualSearch"
        class="text-center py-4 border-t border-dashed border-gray-200"
      >
        <p class="text-sm text-gray-500 mb-3">찾으시는 음식이 없나요?</p>
        <button
          @click="showManualSearch = true"
          class="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
        >
          <MagnifyingGlassIcon class="w-4 h-4" /> 직접 검색하여 추가하기
        </button>
      </div>

      <Transition name="slide-up">
        <div
          v-if="showManualSearch"
          class="grid grid-cols-1 lg:grid-cols-1 gap-4 pt-4 border-t border-gray-200"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-gray-800 text-sm">음식 검색</h4>
            <button
              @click="showManualSearch = false"
              class="text-xs text-gray-400 hover:underline"
            >
              검색창 닫기
            </button>
          </div>

          <div
            class="flex items-center gap-2 border border-gray-200 rounded-xl p-2 shadow-sm bg-white"
          >
            <input
              type="search"
              v-model="searchQuery"
              placeholder="음식 이름을 입력하세요"
              class="flex-1 p-2 outline-none text-sm"
              @keyup.enter="performSearch"
            />
            <button
              @click="performSearch"
              class="bg-[#8A8F6E] text-white p-2.5 rounded-lg hover:bg-[#6e7256] transition"
            >
              <MagnifyingGlassIcon class="w-4 h-4" />
            </button>
          </div>

          <div
            class="border border-gray-200 rounded-xl p-4 shadow-sm bg-white overflow-hidden"
          >
            <div
              v-if="isLoading"
              class="text-center py-10 text-gray-400 text-sm italic"
            >
              정보를 불러오는 중...
            </div>
            <div
              v-else-if="searchResults.length === 0 && searchQuery"
              class="text-center py-10 text-gray-400 text-sm"
            >
              검색 결과가 없습니다.
            </div>
            <div v-else class="overflow-y-auto max-h-[300px] custom-scrollbar">
              <MealSearchFoodItem
                v-for="food in searchResults"
                :key="food.foodCd"
                :food="food"
                @food-added="handleFoodAdded"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useDietStore } from "@/stores/Diet";
import { useMealStore } from "@/stores/Meal";
import axios from "axios";
import {
  PhotoIcon,
  XMarkIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import MealSearchFoodItem from "./MealSearchFoodItem.vue";

const props = defineProps(["formData", "mode"]);
const emit = defineEmits(["update:form-data"]);

const dietStore = useDietStore();
const mealStore = useMealStore();

const isUploading = ref(false);
const showManualSearch = ref(false); // 검색창 노출 여부
const searchQuery = ref("");
const analysisResults = ref([]);

const searchResults = computed(() => mealStore.searchResults);
const isLoading = computed(() => mealStore.isLoading);
const debouncedSearch = mealStore.getDebouncedSearch();

// 이미지 업로드 및 분석
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  analysisResults.value = []; // 이전 결과 초기화

  const previewUrl = URL.createObjectURL(file);
  emit("update:form-data", { ...props.formData, imageUrl: previewUrl });

  try {
    const presign = await dietStore.getPresignedUrl(file.name);
    await axios.put(presign.uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    emit("update:form-data", {
      ...props.formData,
      imageUrl: presign.publicUrl,
    });

    const items = await dietStore.analyzeImage(presign.publicUrl);
    analysisResults.value = items;
  } catch (error) {
    console.error(error);
    alert("이미지 분석에 실패했습니다. 다시 시도해주세요.");
  } finally {
    isUploading.value = false;
  }
}

// AI 키워드 클릭 시
function applyAiKeyword(keyword) {
  showManualSearch.value = true; // 검색 섹션 보여주기
  searchQuery.value = keyword;
  performSearch();
}

const performSearch = () => {
  mealStore.searchMeals(searchQuery.value);
};

watch(searchQuery, (newKeyword) => {
  if (showManualSearch.value) debouncedSearch(newKeyword);
});

const handleFoodAdded = (finalFoodData) => {
  if (!finalFoodData) return;
  const updatedFoods = [
    ...props.formData.foods,
    { ...finalFoodData, sourceType: "IMAGE" },
  ];
  emit("update:form-data", { ...props.formData, foods: updatedFoods });
};

function removeFood(index) {
  const updatedFoods = props.formData.foods.filter((_, i) => i !== index);
  emit("update:form-data", { ...props.formData, foods: updatedFoods });
}

function resetImage() {
  analysisResults.value = [];
  searchQuery.value = "";
  showManualSearch.value = false;
  mealStore.searchResults = [];
  emit("update:form-data", { ...props.formData, imageUrl: "", foods: [] });
}
</script>

<style scoped>
.bg-olive-50 {
  background-color: #f7f8f2;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}

/* 애니메이션 효과 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-active {
  transition: opacity 0.8s;
}
.fade-enter-from {
  opacity: 0;
}
</style>
