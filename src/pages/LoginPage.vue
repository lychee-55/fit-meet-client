<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- LEFT: 로그인 폼 -->
      <div class="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6">
        <h2 class="text-3xl flex justify-center">LOGIN</h2>
        <hr />
        <LoginForm />
      </div>

      <!-- RIGHT: 모바일에서는 숨김 -->
      <div
        class="bg-white rounded-2xl shadow-md p-10 flex-col justify-center items-center gap-4 hidden md:flex"
      >
        <h2>아직 회원가입이 안되셨나요?</h2>

        <DotLottieVue
          style="height: 80px; width: 250px"
          autoplay
          speed="1.6"
          src="https://lottie.host/b13ad04d-dfe4-42a2-9d6b-edcc59cb93a9/fE0AvoTNve.lottie"
        />
        <DotLottieVue
          style="height: 200px; width: 250px"
          autoplay
          speed="1"
          src="https://lottie.host/f1aa641d-d200-4815-9820-0db6a07399bd/meSYimCaEk.lottie"
        />
        <RouterLink
          to="/auth/signup"
          class="inline-flex items-center justify-center space-x-2 px-4 pt-4 text-sm font-medium rounded-lg text-gray-700 hover:border-[#68b478] hover:text-[#68b478] transition duration-150"
        >
          <span> 회원가입 하러가기 </span>
          <ArrowRightIcon class="h-4 w-4" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from "@/components/auth/LoginForm.vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
</script>
