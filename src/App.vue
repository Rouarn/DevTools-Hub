<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { computed } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { WatermarkProps } from 'naive-ui'

defineOptions({
  name: 'App',
})

const darkMode = ref(false)
const naiveDarkTheme = computed(() => (darkMode.value ? darkTheme : undefined))

const naiveLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const naiveDateLocales = {
  'zh-CN': dateZhCN,
  'en-US': dateEnUS,
}

const naiveLocale = computed(() => {
  return naiveLocales['zh-CN']
})

const naiveDateLocale = computed(() => {
  return naiveDateLocales['zh-CN']
})

const watermark = ref({
  text: '我与夏季',
  visible: false,
})

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: watermark.value.text,
    cross: true,
    fullscreen: true,
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15,
    zIndex: 9999,
  }
})

type PluginEnterFrom = 'main' | 'panel' | 'hotkey' | 'redirect'

onMounted(() => {
  window.utools.onPluginEnter(
    (action: {
      code: string
      type: string
      payload: never
      option: never
      from?: PluginEnterFrom
    }) => {
      console.log('action', action)
    },
  )
  window.utools.onPluginOut((isKill: boolean) => {
    console.log('isKill', isKill)
  })
})
</script>

<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <AppProvider>
      <RouterView class="bg-layout mx-30" />
      <NWatermark v-if="watermark.visible" v-bind="watermarkProps" />
    </AppProvider>
  </NConfigProvider>
</template>

<style lang="scss" scoped>
.h-full {
  height: 100%;
  background-image: url('@/assets/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 1;
  position: relative;

  // 背景图透明度 0.5
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); // 设置背景颜色为白色，透明度为0.5
  }
}
</style>
