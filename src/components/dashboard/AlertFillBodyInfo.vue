<template>
  <div
    class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-2 rounded-lg shadow-sm flex justify-between items-center"
    role="alert"
  >
    <p class="font-bold flex items-center gap-2">
      <InformationCircleIcon class="w-5 h-5" />신체 정보 미작성 알림
    </p>
    <div class="flex flex-row items-center">
      <p class="text-sm mr-4 text-yellow-600">
        ※ 일일 권장 섭취량 계산을 위해 추가 정보 작성이 필요합니다.

        <!-- <a
          href="/my-page"
          class="inline-flex items-center gap-1 font-semibold underline hover:text-yellow-700 cursor-pointer"
        >
          <span>작성하러 가기</span>
          <ArrowRightIcon class="w-3 h-3 shrink-0 underline" />
        </a> -->
      </p>
      <button
        @click="Mypage"
        class="text-yellow-600 border border-yellow-600 hover:bg-yellow-600 hover:text-white font-bold py-1 px-3 text-sm rounded transition"
      >
        작성하기
      </button>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import {
  InformationCircleIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline';
// 신체 정보 미작성 시 상단에 표시되는 알림 바입니다.
// 버튼 클릭 시 프로필/정보 수정 페이지로 이동하는 로직이 필요합니다.
const Mypage = () => {
  router.push({ name: 'myPage' });
};
</script>
