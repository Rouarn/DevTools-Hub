<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = () => {
  router.replace('/')
}
</script>

<template>
  <div class="h-100px pos-relative">
    <section
      class="w-full h-70%! z-40 rounded-3xl outline-white/10 md:rounded-xl md:transition-all top-6 px-10"
      style="
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        transition-duration: 300ms;
        font-size: 14px;
        height: auto;
        position: absolute;
      "
    >
      <NSpace class="px-6 h-full" justify="space-between" align="center">
        <div
          class="w-fit h-full flex flex-shrink-0 items-center justify-start"
          style="max-width: 300px"
        >
          <NImage
            alt="logo"
            class="_editable-img_9w82j_95 !w-auto !max-w-[300px] object-cover flex-shrink-0 min-w-0"
            data-element-type="image"
            data-prop-key="logo"
            data-type="image"
            style="height: 40px; background-color: transparent"
            src="logo.png"
          />
        </div>
        <NSpace class="h-full">
          <NButton class="text-white" :bordered="false" @click="handleClick"> 主页 </NButton>
          <NButton class="text-white" :bordered="false"> 工具页 </NButton>
          <NButton class="text-white" :bordered="false"> 关于我们 </NButton>
        </NSpace>
      </NSpace>
    </section>
  </div>
</template>

<style lang="scss" scoped>
section {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
}
</style>
