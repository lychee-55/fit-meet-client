<template>
  <div class="auth-layout">
    <!-- <Header /> -->

    <div class="container">
      <div class="left">
        <slot name="left" />
      </div>

      <div class="right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/common/Header.vue";
</script>

<style scoped>
.auth-layout {
  width: 100%;
}
.container {
  display: flex;
}
.left {
  width: 50%;
  padding: 2rem;
}
.right {
  width: 50%;
  padding: 2rem;
}
</style>
