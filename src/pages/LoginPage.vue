<template>
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
</template>

<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import LoginForm from "../components/auth/LoginForm.vue";
</script>
