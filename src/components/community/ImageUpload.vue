<template>
  <div
    class="relative aspect-4/3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden group cursor-pointer hover:border-[#8A8F6E] transition-all"
    @click="triggerInput"
  >
    <img
      v-if="previewUrl"
      :src="previewUrl"
      class="w-full h-full object-cover"
    />
    <div
      v-else
      class="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
    >
      <div class="p-4 bg-white rounded-full shadow-sm mb-3">
        <PlusIcon class="w-8 h-8 text-[#8A8F6E]" />
      </div>
      <p class="text-sm font-medium">사진을 업로드해주세요</p>
    </div>

    <input
      type="file"
      ref="fileInput"
      class="hidden"
      @change="onFileChange"
      accept="image/*"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['initialPreview']);
const emit = defineEmits(['image-change']);

const fileInput = ref(null);
const previewUrl = ref(props.initialPreview);

const triggerInput = () => fileInput.value.click();

const onFileChange = e => {
  const file = e.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
    emit('image-change', { file, preview: previewUrl.value });
  }
};

watch(
  () => props.initialPreview,
  newVal => {
    previewUrl.value = newVal;
  },
);
</script>
