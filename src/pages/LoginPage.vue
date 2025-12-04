<!-- <template>
  <AuthLayout>
    <template #left>
      <h2>로그인</h2>
      <LoginForm />
    </template>

    <template #right>
      <div>
        <p>아직 회원가입이 안되셨나요?</p>
        <RouterLink to="/signup">회원가입 하러가기</RouterLink>
      </div>
    </template>
  </AuthLayout>
</template> -->

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#ffffff]">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- LEFT 박스: 로그인 폼 -->
      <div class="bg-[#ffffff] rounded-2xl shadow-md p-10 flex flex-col gap-6">
        <slot name="left">
          <h2 class="text-3xl flex justify-center">LOGIN</h2>
          <hr />
          <login-form
        /></slot>
      </div>

      <!-- RIGHT 박스: 회원가입 유도 -->
      <div
        class="bg-[#ffffff] backdrop-blur-sm rounded-2xl shadow-md p-10 flex flex-col justify-center items-center gap-4"
      >
        <slot name="right">
          <p>아직 회원가입이 안되셨나요?</p>
          <RouterLink to="/auth/signup" class="hover:text-[#68b478]"
            >회원가입 하러가기</RouterLink
          >
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
</script>
