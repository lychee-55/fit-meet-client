<template>
  <form @submit.stop.prevent="handleSubmit" class="space-y-8">
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="w-full lg:w-1/2">
        <label class="block text-sm font-bold text-gray-700 mb-3 ml-1"
          >대표 이미지</label
        >
        <ImageUpload
          @image-change="handleImageChange"
          :initial-preview="postData.imagePreview"
        />
      </div>

      <div class="w-full lg:w-1/2 space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >제목 *</label
          >
          <input
            v-model="postData.title"
            type="text"
            @keydown.enter.prevent
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8A8F6E] outline-none"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >카테고리 *</label
          >
          <select
            v-model="postData.category"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
          >
            <option value="GENERAL">전체</option>
            <option value="DIET_STREAK">식단스트릭</option>
            <option value="WORKOUT">운동인증</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >내용 *</label
          >
          <textarea
            v-model="postData.content"
            rows="4"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none resize-none"
          ></textarea>
        </div>

        <TagInput
          :tags="postData.tags"
          @add-tag="addTag"
          @remove-tag="removeTag"
        />
      </div>
    </div>

    <div class="bg-[#F8F9FA] p-6 rounded-3xl">
      <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span class="w-1 h-4 bg-[#8A8F6E] rounded-full"></span> 활동 공유 설정
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <label
          v-for="opt in ['shareDiet', 'shareStreak', 'shareWorkout']"
          :key="opt"
          class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer shadow-sm"
        >
          <input
            type="checkbox"
            v-model="postData[opt]"
            class="w-5 h-5 accent-[#8A8F6E]"
          />
          <span class="text-sm font-medium text-gray-700">{{
            opt === 'shareDiet'
              ? '식단 공유'
              : opt === 'shareStreak'
              ? '스트릭 공유'
              : '운동 공유'
          }}</span>
        </label>
      </div>

      <ActivitySelector
        v-if="postData.shareDiet || postData.shareWorkout"
        :shareDiet="postData.shareDiet"
        :shareWorkout="postData.shareWorkout"
        :availableDiets="filteredRecentDiets"
        :todayCompletedVideos="todayCompletedVideos"
        v-model:selectedDietIds="postData.dietIds"
        v-model:selectedWorkoutIds="postData.workoutVideoIds"
        v-model:dietNote="postData.dietNote"
        v-model:workoutNote="postData.workoutNote"
      />
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full bg-[#8A8F6E] text-white font-bold py-4 rounded-2xl hover:bg-[#767a5d] transition-all disabled:bg-gray-300"
    >
      {{ isLoading ? '처리 중...' : isEditMode ? '수정하기' : '등록하기' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCommunityStore } from '@/stores/Community';
import { useDietStore } from '@/stores/Diet';
import { useTrainingStore } from '@/stores/Training';
import { useDashboardStore } from '@/stores/Dashboard';
import ImageUpload from './ImageUpload.vue';
import TagInput from './TagInput.vue';
import ActivitySelector from './ActivitySelector.vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
  mode: { type: String, default: 'create' },
  postId: { type: String, default: null },
});
const router = useRouter();
const communityStore = useCommunityStore();
const dietStore = useDietStore();
const trainingStore = useTrainingStore();
const dashboardStore = useDashboardStore();
const todayDiets = ref([]);
const isEditMode = computed(() => props.mode === 'edit');
const isLoading = ref(false);

const postData = reactive({
  title: '',
  content: '',
  category: 'GENERAL',
  tags: [],
  image: null,
  imagePreview: null,
  activityDate: new Date().toISOString().split('T')[0],
  shareDiet: false,
  shareStreak: false,
  shareWorkout: false,
  dietNote: '',
  dietIds: [],
  workoutNote: '',
  workoutVideoIds: [],
});

// 수정 모드일 때 초기 데이터 로드
const initEditData = async () => {
  if (isEditMode.value && props.postId) {
    isLoading.value = true;
    try {
      const data = await communityStore.fetchPostDetail(props.postId);
      // 서버 데이터를 postData에 매핑
      postData.title = data.title;
      postData.content = data.content;
      postData.category = data.category;
      postData.tags = [...data.tags];
      postData.imagePreview = data.postImageUrl;
      postData.activityDate = data.activityDate;
      postData.shareDiet = data.shareDiet;
      postData.shareStreak = data.shareStreak;
      postData.shareWorkout = data.shareWorkout;
      postData.dietNote = data.dietNote || '';
      postData.workoutNote = data.workoutNote || '';

      postData.dietIds = data.dietIds || [];
      postData.workoutVideoIds = data.workoutVideoIds || [];
    } catch (error) {
      alert('데이터를 불러오는데 실패했습니다.');
      router.back();
    } finally {
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  initEditData();
});

// 날짜 포맷 함수 (에러 방지용)
const formatDateToString = d => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// 최근 일주일 식단 중 "isPublic === true"인 것만 필터링
const filteredRecentDiets = computed(() => {
  const allDiets = [];
  if (dietStore.dailyDietMap) {
    Object.values(dietStore.dailyDietMap).forEach(list => {
      if (Array.isArray(list)) {
        const publicOnly = list.filter(
          diet => diet.isPublic === true || diet.public === true,
        );
        allDiets.push(...publicOnly);
      }
    });
  }
  return allDiets.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 운동 데이터 (storeToRefs를 사용하여 반응성 유지)
const { todayCompletedVideos } = storeToRefs(trainingStore);

// watch 로직: 체크박스 켤 때 데이터 로드
watch(
  () => [postData.shareDiet, postData.shareWorkout],
  async ([dietOn, workoutOn]) => {
    if (dietOn) {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const startDate = formatDateToString(lastWeek);
      const endDate = formatDateToString(today);
      await dietStore.fetchMonthDiets(startDate, endDate);
    }
    if (workoutOn) {
      await trainingStore.fetchTodayCompletedVideos();
    }
  },
);

const handleImageChange = ({ file, preview }) => {
  postData.image = file;
  postData.imagePreview = preview;
};

// 태그 추가 로직
const addTag = newTag => {
  if (!postData.tags.includes(newTag)) {
    if (postData.tags.length < 10) {
      postData.tags.push(newTag);
    } else {
      alert('태그는 최대 10개까지 등록 가능합니다.');
    }
  }
};

const removeTag = index => {
  postData.tags.splice(index, 1);
};

// 제출 로직 (분기 처리)
const handleSubmit = async () => {
  if (isEditMode.value && !props.postId) {
    return alert('수정할 게시글 정보를 찾을 수 없습니다.');
  }
  if (!postData.title.trim() || !postData.content.trim())
    return alert('필수 항목을 채워주세요.');

  isLoading.value = true;
  const formData = new FormData();

  // 이미지가 새로 선택된 경우에만 append
  if (postData.image instanceof File) {
    formData.append('image', postData.image);
  } else {
    formData.append('image', '');
  }

  const requestDto = {
    title: postData.title,
    content: postData.content,
    category: postData.category,
    tags: postData.tags,
    activityDate: postData.activityDate,
    shareDiet: postData.shareDiet,
    shareStreak: postData.shareStreak,
    shareWorkout: postData.shareWorkout,
    dietNote: postData.dietNote,
    dietIds: postData.dietIds,
    workoutNote: postData.workoutNote,
    workoutVideoIds: postData.workoutVideoIds,
  };

  formData.append(
    'data',
    new Blob([JSON.stringify(requestDto)], { type: 'application/json' }),
  );

  try {
    if (isEditMode.value) {
      await communityStore.updatePost(props.postId, formData);
      alert('게시글이 수정되었습니다!');
    } else {
      await communityStore.createPost(formData);
      alert('게시글이 등록되었습니다!');
    }
    router.push('/community');
  } catch (error) {
    console.error(error);
    alert(`${isEditMode.value ? '수정' : '등록'} 중 오류가 발생했습니다.`);
  } finally {
    isLoading.value = false;
  }
};
</script>
