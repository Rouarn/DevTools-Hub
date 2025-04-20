<template>
  <div class="tools-card" :style="{ width: width }" @click="handleClick">
    <div class="c-white text-20px font-bold mt-15px">{{ title }}</div>
    <div class="c-white text-12px font-100 mt-10px">{{ subTitle }}</div>
    <NButton class="pos-absolute left-5px bottom-5px c-white text-10px" :bordered="false">
      立即使用
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'

const props = defineProps<{
  title: string
  subTitle: string
  link: string
  width?: string
}>()

const emit = defineEmits<{
  (e: 'click', link: string): void
}>()

const handleClick = () => {
  emit('click', props.link)
}
</script>

<style lang="scss" scoped>
.tools-card {
  height: 100%;
  max-height: 150px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  padding-left: 15px;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
}
</style>
