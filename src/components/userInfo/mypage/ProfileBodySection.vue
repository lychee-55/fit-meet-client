<template>
  <section>
    <h4 class="text-xl font-semibold text-[#8A8F6E] mb-5">건강 및 신체 정보</h4>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label class="text-base font-medium text-gray-700">성별</label>

        <div v-if="isEditMode" class="flex gap-4 justify-center w-full">
          <button
            type="button"
            @click="modelValue.gender = 'MALE'"
            :class="genderButtonClasses('MALE')"
          >
            남성
          </button>
          <button
            type="button"
            @click="modelValue.gender = 'FEMALE'"
            :class="genderButtonClasses('FEMALE')"
          >
            여성
          </button>
        </div>

        <div v-else class="flex items-center">
          <input
            type="text"
            :value="displayGender"
            readonly
            :class="inputClasses"
            class="w-full bg-gray-100 cursor-default text-gray-700"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-base font-medium text-gray-700">생년월일</label>
        <input
          type="date"
          v-model="modelValue.birth_date"
          :readonly="!isEditMode"
          :class="inputClasses"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-base font-medium text-gray-700">현재 키 (cm)</label>
        <input
          type="number"
          v-model.number="modelValue.height_cm"
          min="130"
          max="200"
          step="0.5"
          placeholder="키"
          :readonly="!isEditMode"
          :class="inputClasses"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-base font-medium text-gray-700">평소 활동량</label>
        <select
          v-model="modelValue.activity_level"
          :disabled="!isEditMode"
          :class="inputClasses"
        >
          <option value="NONE">거의 없음</option>
          <option value="LOW">낮음</option>
          <option value="MID">보통</option>
          <option value="HIGH">높음</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-base font-medium text-gray-700"
          >현재 체중 (kg)</label
        >
        <div v-if="isEditMode" class="border rounded-xl border-[#D3D7B5]">
          <NumberPicker
            v-model="modelValue.weight_kg"
            :min="40"
            :max="150"
            :step="0.5"
            unit="kg"
            :default-value="70"
          />
        </div>
        <input
          v-else
          type="number"
          :value="modelValue.weight_kg"
          placeholder="체중"
          readonly
          :class="inputClasses"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-base font-medium text-gray-700"
          >목표 체중 (kg)</label
        >
        <div v-if="isEditMode" class="border rounded-xl border-[#D3D7B5]">
          <NumberPicker
            v-model="modelValue.target_weight_kg"
            :min="30"
            :max="150"
            :step="0.5"
            unit="kg"
            :default-value="60"
          />
        </div>
        <input
          v-else
          type="number"
          :value="modelValue.target_weight_kg"
          placeholder="목표 체중"
          readonly
          :class="inputClasses"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// NumberPicker import가 상위 폴더로 변경되었습니다.
import NumberPicker from '@/components/common/NumberPicker.vue';
import { computed } from 'vue';

const props = defineProps({
  modelValue: Object, // formData 객체
  isEditMode: Boolean,
});

const displayGender = computed(() => {
  if (!props.modelValue.gender) return '미입력';
  return props.modelValue.gender === 'MALE' ? '남성' : '여성';
});

// 성별 버튼 클래스: max-w-xs 대신 flex-1을 사용하여,
// 부모 div (max-w-xs) 내에서 공간을 균등 분할하도록 조정했습니다.
const genderButtonClasses = computed(() => gender => {
  const isSelected = props.modelValue.gender === gender;
  const base =
    'px-6 py-3 rounded-xl border text-base font-medium transition flex-1';

  if (isSelected) {
    return [
      base,
      'bg-[#D3A373] text-white border-[#D3A373] hover:orange-bg-color',
    ];
  } else {
    return [base, 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'];
  }
});

const inputBaseClass =
  'px-4 py-3 rounded-xl border border-[#D3D7B5] outline-none transition';
const editModeClasses = 'bg-white focus:ring-2 focus:ring-[#D3A373]';
const viewModeClasses = 'bg-gray-100 cursor-default text-gray-700';

const inputClasses = computed(() => {
  return [
    inputBaseClass,
    props.isEditMode ? editModeClasses : viewModeClasses,
    !props.isEditMode && 'appearance-none',
  ];
});
</script>
