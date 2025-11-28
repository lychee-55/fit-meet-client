<template>
  <AuthLayout>
    <template #left>
      <h2>회원가입</h2>
      <SignupForm />
    </template>

    <template #right>
      <div>
        <p>이미 계정이 있으신가요?</p>
        <RouterLink to="/login">로그인 하러가기</RouterLink>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import SignupForm from "../components/auth/SignupForm.vue";
</script>
