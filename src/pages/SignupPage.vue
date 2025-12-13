<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- LEFT -->
      <div class="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6">
        <h2 class="text-3xl flex justify-center">SIGNUP</h2>
        <hr />
        <SignupForm />
      </div>

      <!-- RIGHT: 모바일에서는 숨김 -->
      <div
        class="bg-white rounded-2xl shadow-md p-10 flex-col justify-center items-center gap-4 hidden md:flex"
      >
        <h2>이미 계정이 있으신가요?</h2>

        <!-- <DotLottieVue
          style="height: 300px; width: 300px"
          autoplay
          speed="1"
          src="https://lottie.host/05235080-1053-437d-98f3-dde1c5f7a31a/iINGMsXQSw.lottie"
        /> -->

        <RouterLink
          to="/auth/login"
          class="inline-flex items-center justify-center space-x-2 px-4 pt-4 text-sm font-medium rounded-lg text-gray-700 hover:border-[#68b478] hover:text-[#68b478] transition duration-150"
        >
          <span> 로그인 하러가기 </span>
          <ArrowRightIcon class="h-4 w-4" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import SignupForm from '@/components/auth/SignupForm.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
</script>
