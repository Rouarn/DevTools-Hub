<template>
  <div class="not-container">
    <img src="@/assets/images/403.png" class="not-img" alt="403" />
    <div class="not-detail">
      <h2>403</h2>
      <h4>抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</h4>
      <NButton type="primary" @click="router.back"> 返回上一页 </NButton>
    </div>
  </div>
</template>

<script setup lang="ts" name="403">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
