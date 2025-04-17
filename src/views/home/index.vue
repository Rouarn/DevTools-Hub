<script lang="ts" setup>
import { NDivider, NFlex } from 'naive-ui'
import { reactive, ref } from 'vue'

// 定义 source 为 ref 包装的初始值
const rawSource = ref(0)

setInterval(() => {
  rawSource.value = 25 // 更新原始值
}, 100)

const tools = reactive([
  {
    title: 'JS对象 转 TS类型',
    subTitle: '用于快速生成 TS 类型',
    link: '/jstots',
  },
  {
    title: 'JS对象 转 JSON',
    subTitle: '用于快速生成 JSON 对象',
    link: '/jstojson',
  },
])
</script>

<template>
  <NFlex vertical>
    <NDivider
      class="bg-white/40 dark:bg-black/40 transition-all duration-300 ease-in-out"
      :style="{
        width: `${rawSource}rem`,
      }"
    />

    <NP class="font-bold text-15 c-white">开发者工具集</NP>

    <NP class="font-100 text-1.25rem c-white mt-10"
      >探索我们精心打造的开发工具集，助您提升开发效率</NP
    >

    <NScrollbar x-scrollable>
      <NFlex
        inline
        class="w-full whitespace-nowrap pl-5px overflow-hidden cursor-pointer"
        :wrap="false"
      >
        <div
          class="tools-card"
          v-for="(tool, index) in tools"
          :key="index"
          @click="() => $router.push(tool.link)"
        >
          <div class="c-white text-20px font-bold mt-15px">{{ tool.title }}</div>
          <div class="c-white text-12px font-100 mt-10px">{{ tool.subTitle }}</div>
          <NButton class="pos-absolute left-5px bottom-5px c-white text-10px" :bordered="false">
            立即使用
          </NButton>
        </div>
      </NFlex>
    </NScrollbar>
  </NFlex>
</template>

<style lang="scss" scoped>
.tools-card {
  width: 271px;
  height: 100%;
  max-height: 150px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  padding-left: 15px;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
}

:deep(.n-scrollbar-content) {
  height: 100%;

  & > * {
    height: 100%;
  }
}
</style>
