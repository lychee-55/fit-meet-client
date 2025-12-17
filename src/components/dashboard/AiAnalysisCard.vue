<template>
  <div
    class="p-6 rounded-xl shadow-lg flex flex-col justify-between items-center text-center"
    style="
      background: linear-gradient(
        135deg,
        #f7fafc 0%,
        #e0f2fe 30%,
        #fef3c7 70%,
        #d1fae5 100%
      );
      color: #1f2937;
    "
  >
    <div class="mb-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-amber-500 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>

    <div class="text-gray-800">
      <h3 class="text-xl font-extrabold mb-1">
        <span class="text-green-600">AI</span> 맞춤 분석
      </h3>
      <p class="text-sm opacity-80 mb-4">
        이번 주 식단을 AI가 분석해 드립니다.
      </p>
    </div>

    <button
      class="bg-green-500 text-white font-bold py-2 px-4 rounded-full w-full hover:bg-green-600 transition duration-200 shadow-md"
      @click="$emit('analyze')"
    >
      분석 시작
    </button>
  </div>
</template>
