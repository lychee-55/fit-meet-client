<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
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
          <label
            for="title"
            class="block text-sm font-bold text-gray-700 mb-2 ml-1"
            >제목 *</label
          >
          <input
            id="title"
            v-model="postData.title"
            type="text"
            placeholder="제목을 입력하세요"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8A8F6E] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2 ml-1"
            >카테고리 *</label
          >
          <select
            v-model="postData.category"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8A8F6E] outline-none"
          >
            <option value="GENERAL">전체</option>
            <option value="DIET_STREAK">식단스트릭</option>
            <option value="CHALLENGE">챌린지</option>
            <option value="WORKOUT">운동인증</option>
          </select>
        </div>

        <div>
          <label
            for="content"
            class="block text-sm font-bold text-gray-700 mb-2 ml-1"
            >내용 *</label
          >
          <textarea
            id="content"
            v-model="postData.content"
            rows="5"
            placeholder="오늘의 건강한 이야기를 들려주세요"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8A8F6E] focus:bg-white transition-all outline-none resize-none"
          ></textarea>
        </div>

        <TagInput
          :tags="postData.tags"
          @add-tag="addTag"
          @remove-tag="removeTag"
        />
      </div>
    </div>

    <hr class="border-gray-100" />

    <div class="bg-[#F8F9FA] p-6 rounded-3xl space-y-4">
      <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
        <span class="w-1 h-4 bg-[#8A8F6E] rounded-full"></span>
        공유 옵션
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label
          class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:shadow-sm transition"
        >
          <input
            type="checkbox"
            v-model="postData.shareDiet"
            class="w-5 h-5 accent-[#8A8F6E]"
          />
          <span class="text-sm font-medium text-gray-700">식단 기록 공유</span>
        </label>
        <label
          class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:shadow-sm transition"
        >
          <input
            type="checkbox"
            v-model="postData.shareStreak"
            class="w-5 h-5 accent-[#8A8F6E]"
          />
          <span class="text-sm font-medium text-gray-700"
            >스트릭 현황 공유</span
          >
        </label>
        <label
          class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:shadow-sm transition"
        >
          <input
            type="checkbox"
            v-model="postData.shareWorkout"
            class="w-5 h-5 accent-[#8A8F6E]"
          />
          <span class="text-sm font-medium text-gray-700">운동 정보 공유</span>
        </label>
      </div>
    </div>

    <button
      type="submit"
      class="w-full bg-[#8A8F6E] text-white font-bold py-4 rounded-2xl hover:bg-[#767a5d] shadow-lg shadow-[#8A8F6E]/20 transition-all active:scale-[0.98]"
    >
      {{ isEditMode ? '게시글 수정하기' : '게시글 등록하기' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ImageUpload from './ImageUpload.vue';
import TagInput from './TagInput.vue';

const props = defineProps({
  mode: {
    type: String,
    default: 'create', // 기본값은 작성 모드
  },
  postId: {
    type: String,
    required: false,
  },
});

const router = useRouter();
const isEditMode = computed(() => props.mode === 'edit');

const postData = reactive({
  title: '',
  content: '',
  category: 'FREE',
  tags: [],
  image: null,
  imagePreview: null,
  activityDate: new Date().toISOString().split('T')[0],
  shareDiet: false,
  shareStreak: false,
  shareWorkout: false,
  workoutNote: '',
  workoutVideoId: null,
  workoutVideoUrl: '',
});

// 이미지 변경 핸들러
const handleImageChange = ({ file, preview }) => {
  postData.image = file;
  postData.imagePreview = preview;
};

// 태그 관리
const addTag = tag => {
  if (!postData.tags.includes(tag)) postData.tags.push(tag);
};
const removeTag = index => {
  postData.tags.splice(index, 1);
};

// 수정시
onMounted(async () => {
  // 모드가 'edit'이고 수정할 ID가 있을 때만 데이터를 가져옴
  if (isEditMode.value && props.postId) {
    try {
      const response = await axios.get(`/api/community/${props.postId}`);
      if (response.data) {
        // 가져온 데이터를 폼 상태(postData)에 덮어쓰기
        Object.assign(postData, response.data);
        // 이미지가 있다면 프리뷰도 설정
        if (response.data.imageUrl) {
          postData.imagePreview = response.data.imageUrl;
        }
      }
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 불러올 수 없습니다.');
      router.push('/community');
    }
  }
});

// 전송 로직
const handleSubmit = async () => {
  if (!postData.title.trim()) return alert('제목을 입력해주세요.');

  const formData = new FormData();
  if (postData.image) formData.append('image', postData.image);

  // API 스펙에 맞춘 JSON 데이터 구성
  const requestBody = {
    title: postData.title,
    content: postData.content,
    category: postData.category,
    tags: postData.tags,
    activityDate: postData.activityDate,
    shareDiet: postData.shareDiet,
    shareStreak: postData.shareStreak,
    shareWorkout: postData.shareWorkout,
    workoutNote: postData.workoutNote,
  };

  formData.append(
    'data',
    new Blob([JSON.stringify(requestBody)], { type: 'application/json' }),
  );

  try {
    const url = isEditMode.value
      ? `/api/community/${props.postId}`
      : '/api/community';
    const method = isEditMode.value ? 'put' : 'post';

    await axios[method](url, formData);
    alert('성공적으로 저장되었습니다!');
    router.push('/community');
  } catch (error) {
    console.error(error);
    alert('저장 중 오류가 발생했습니다.');
  }
};
</script>
