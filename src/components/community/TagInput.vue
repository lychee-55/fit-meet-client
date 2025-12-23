<template>
  <div>
    <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">태그</label>
    <div class="flex gap-2">
      <input
        v-model="newTag"
        @keydown.enter.prevent="handleAddTag"
        type="text"
        placeholder="태그 입력 후 Enter"
        class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8A8F6E] outline-none"
      />
      <button
        type="button"
        @click="handleAddTag"
        class="px-6 bg-[#FCE179] text-gray-700 font-bold rounded-2xl hover:bg-[#FADC5F]"
      >
        추가
      </button>
    </div>
    <div class="flex flex-wrap gap-2 mt-3">
      <span
        v-for="(tag, i) in tags"
        :key="i"
        class="px-3 py-1 bg-[#8A8F6E]/10 text-[#8A8F6E] text-xs font-bold rounded-full flex items-center gap-1"
      >
        #{{ tag }}
        <button
          type="button"
          @click="$emit('remove-tag', i)"
          class="hover:text-red-500 font-bold ml-1"
        >
          ×
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['tags']);
const emit = defineEmits(['add-tag', 'remove-tag']);
const newTag = ref('');

const handleAddTag = () => {
  const trimmed = newTag.value.trim();
  if (trimmed) {
    emit('add-tag', trimmed);
    newTag.value = '';
  }
};
</script>
