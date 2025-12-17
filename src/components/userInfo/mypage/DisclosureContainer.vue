<template>
  <div class="bg-white shadow-xl rounded-2xl divide-y divide-gray-200">
    <Disclosure v-slot="{ open }" :defaultOpen="true">
      <DisclosureButton :class="disclosureButtonClass(open)">
        <span class="flex items-center gap-3">
          <UserIcon class="w-6 h-6 text-blue-600" />
          내 프로필 및 신체정보
        </span>
        <ChevronUpIcon
          :class="[
            open ? 'rotate-180 transform' : '',
            'h-5 w-5 text-gray-500 transition duration-200',
          ]"
        />
      </DisclosureButton>
      <Transition name="disclosure-slide">
        <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
          <ProfileUserAndBodySetting />
        </DisclosurePanel>
      </Transition>
    </Disclosure>

    <Disclosure v-slot="{ open }">
      <DisclosureButton :class="disclosureButtonClass(open)">
        <span class="flex items-center gap-3">
          <KeyIcon class="w-6 h-6 text-yellow-600" />
          비밀번호 변경
        </span>
        <ChevronUpIcon
          :class="[
            open ? 'rotate-180 transform' : '',
            'h-5 w-5 text-gray-500 transition duration-200',
          ]"
        />
      </DisclosureButton>
      <Transition name="disclosure-slide">
        <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
          <PasswordChange />
        </DisclosurePanel>
      </Transition>
    </Disclosure>

    <Disclosure v-slot="{ open }">
      <DisclosureButton :class="disclosureButtonClass(open)">
        <span class="flex items-center gap-3">
          <TrashIcon class="w-6 h-6 text-red-600" />
          회원 탈퇴
        </span>
        <ChevronUpIcon
          :class="[
            open ? 'rotate-180 transform' : '',
            'h-5 w-5 text-gray-500 transition duration-200',
          ]"
        />
      </DisclosureButton>
      <Transition name="disclosure-slide">
        <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
          <AccountDelete />
        </DisclosurePanel>
      </Transition>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import {
  ChevronUpIcon,
  UserIcon,
  HeartIcon,
  KeyIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';

// 각 설정 컴포넌트 임포트
import PasswordChange from './PasswordChange.vue';
import AccountDelete from './AccountDelete.vue';
import ProfileUserAndBodySetting from './ProfileUserAndBodySetting.vue';

// Disclosure Button의 공통 Tailwind 클래스
const disclosureButtonClass = open => [
  'flex w-full justify-between rounded-t-lg px-6 py-4 text-left text-lg font-medium text-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition duration-150',
  open ? 'bg-[#FAEDCD] hover:bg-[#FAEDCD]' : 'hover:bg-[#FEF9E1]',
];
</script>

<style scoped>
/* Vue Transition CSS */
.disclosure-slide-enter-active,
.disclosure-slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px; /* 충분히 큰 값으로 설정 */
}

.disclosure-slide-enter-from,
.disclosure-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
