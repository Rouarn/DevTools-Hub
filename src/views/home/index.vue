<script lang="ts" setup>
import { NSpace, NDivider } from 'naive-ui'
import { ref } from 'vue'

// 定义 source 为 ref 包装的初始值
const rawSource = ref(0)

setInterval(() => {
  rawSource.value = 25 // 更新原始值
}, 100)
</script>

<template>
  <NSpace>
    <!-- 使用 transitionedSource 的值 -->
    <NDivider
      class="bg-white/40 dark:bg-black/40 transition-all duration-300 ease-in-out"
      :style="{
        width: `${rawSource}rem`,
      }"
    />
  </NSpace>
</template>

<style></style>
