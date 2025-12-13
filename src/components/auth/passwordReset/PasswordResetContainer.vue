<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-3xl grid grid-cols-1 md: gap-8 p-6">
      <div class="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-4">
        <h2 class="text-3xl flex justify-center">비밀번호 재설정</h2>
        <p class="text-sm text-gray-400 text-center">
          가입한 이메일을 통해 비밀번호를 재설정하세요.
        </p>
        <hr />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
