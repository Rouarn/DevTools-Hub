<template>
  <NLayoutContent
    class="flex-1 p-4 bg-transparent tools-card"
    content-class="bg-transparent"
    :content-style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }"
  >
    <div class="flex gap-2 mb-4 ml-a">
      <NButton type="primary" @click="convert">
        <template #icon>
          <NIcon :component="RefreshOutline" />
        </template>
        转换
      </NButton>
      <NButton @click="clearAll" type="info">
        <template #icon>
          <NIcon :component="TrashOutline" />
        </template>
        清空
      </NButton>

      <!-- 回到顶部按钮 -->
      <NFlex justify="center" align="center">
        <NButton type="primary" circle size="small" @click="scrollbarRef.scrollTo({ top: 0 })">
          <template #icon>
            <NIcon :component="ArrowUpCircleOutline" />
          </template>
        </NButton>
      </NFlex>
    </div>

    <NScrollbar content-class="h-full" ref="scrollbarRef">
      <div class="grid grid-cols-2 gap-4 flex-1 h-full">
        <CodeEditor
          ref="inputEditorRef"
          title="JavaScript 对象"
          :editable="true"
          language="javascript"
          :onContentChange="handleInputChange"
        />

        <CodeEditor ref="outputEditorRef" title="JSON 对象" :editable="false" />
      </div>
    </NScrollbar>
  </NLayoutContent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RefreshOutline, TrashOutline, ArrowUpCircleOutline } from '@vicons/ionicons5'
import { NIcon, NButton, NLayoutContent, useMessage, NScrollbar, NFlex } from 'naive-ui'
import CodeEditor from '@/components/common/code-editor.vue'

const message = useMessage()
const inputEditorRef = ref()
const outputEditorRef = ref()
const scrollbarRef = ref<any>()
const hasInitialContent = ref(false)

// 转换函数
const convert = (): void => {
  try {
    const input = inputEditorRef.value?.getContent()
    if (!input?.trim()) {
      throw new Error('请输入有效的 JavaScript 对象')
    }

    const obj = parseInput(input)
    const jsonString = JSON.stringify(obj, null, 2)
    outputEditorRef.value?.setContent(jsonString)

    message.success('转换成功!')
    hasInitialContent.value = true
  } catch (e) {
    message.error((e as Error).message)
  }
}

// 解析输入
const parseInput = (input: string): any => {
  try {
    const cleanInput = input
      .replace(/(['"])?([a-zA-Z0-9_-]+)(['"])?:/g, '"$2":') // 允许匹配带连字符的属性名
      .replace(/,(\s*})/g, '$1')

    const fn = new Function(`return ${cleanInput}`)
    const obj = fn()

    if (typeof obj !== 'object' || obj === null) {
      throw new Error('请输入有效的对象')
    }
    return obj
  } catch (e) {
    throw new Error('解析失败: ' + (e as Error).message)
  }
}

// 处理输入变化
const handleInputChange = () => {
  if (!hasInitialContent.value) {
    setTimeout(convert, 100)
  }
}

// 清空功能
const clearAll = (): void => {
  inputEditorRef.value?.setContent('')
  outputEditorRef.value?.setContent('')
  hasInitialContent.value = false
  message.info('已清空所有内容')
}
</script>

<style lang="scss" scoped>
.tools-card {
  height: 100%;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
