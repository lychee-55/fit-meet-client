<template>
  <div class="h-auto p-6 sm:p-6 flex justify-center bg-[#f9f9f5] min-h-[520px]">
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-8">
      <div class="mb-5">
        <button
          @click="goBack"
          class="flex items-center text-gray-400 hover:text-[#8A8F6E] transition font-bold text-sm"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          <span>뒤로가기</span>
        </button>
      </div>

      <HandleSubmitDietForm :mode="creationMethod" :diet-id="dietId" />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HandleSubmitDietForm from '@/components/diet/formElements/HandleSubmitDietForm.vue';

const router = useRouter();
const route = useRoute();

// URL의 :method 파라미터 ('manual' 또는 'public-api')
const creationMethod = computed(() => route.params.method);

// URL의 :id 파라미터
const dietId = computed(() => route.params.id);

const goBack = () => {
  router.back();
};
</script>
