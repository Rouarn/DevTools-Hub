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
        <!-- 输入面板 -->
        <NCard class="h-full bg-transparent tools-card" content-class="h-full flex flex-col p-0">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <NIcon color="#fff" :component="CodeWorkingOutline" />
                <span class="color-#fff">JavaScript 对象</span>
              </div>
              <NButton text @click="copyInput">
                <template #icon>
                  <NIcon color="#fff" :component="CopyOutline" />
                </template>
              </NButton>
            </div>
          </template>
          <div ref="inputEditorRef" class="flex-1 overflow-hidden"></div>
        </NCard>

        <!-- 输出面板 -->
        <NCard class="h-full bg-transparent tools-card" content-class="h-full flex flex-col p-0">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <NIcon color="#fff" :component="CodeWorkingOutline" />
                <span class="color-#fff">JSON 对象</span>
              </div>
              <NButton text @click="copyOutput">
                <template #icon>
                  <NIcon color="#fff" :component="CopyOutline" />
                </template>
              </NButton>
            </div>
          </template>
          <div ref="outputEditorRef" class="flex-1 overflow-hidden"></div>
        </NCard>
      </div>
    </NScrollbar>
  </NLayoutContent>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EditorView, keymap } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'
import {
  CopyOutline,
  RefreshOutline,
  CodeWorkingOutline,
  TrashOutline,
  ArrowUpCircleOutline,
} from '@vicons/ionicons5'
import { NIcon, NButton, NCard, NLayoutContent, useMessage, NScrollbar } from 'naive-ui'
import { defaultKeymap } from '@codemirror/commands'

const message = useMessage()

// 编辑器实例
const inputEditorRef = ref<HTMLElement>()
const outputEditorRef = ref<HTMLElement>()
let inputEditor: EditorView | null = null
let outputEditor: EditorView | null = null
const hasInitialContent = ref(false)
const scrollbarRef = ref<any>()

// 初始化编辑器
onMounted(() => {
  inputEditor = new EditorView({
    doc: '',
    extensions: [
      basicSetup,
      javascript(),
      oneDark,
      keymap.of([...defaultKeymap, { key: 'Mod-Enter', run: () => (convert(), true) }]),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !hasInitialContent.value) {
          setTimeout(convert, 100)
        }
      }),
    ],
    parent: inputEditorRef.value!,
  })

  outputEditor = new EditorView({
    doc: '',
    extensions: [basicSetup, oneDark, EditorView.editable.of(false), EditorView.lineWrapping],
    parent: outputEditorRef.value!,
  })
})

// 获取编辑器内容
const getEditorContent = (editor: EditorView | null): string => {
  return editor?.state.doc.toString() || ''
}

// 设置编辑器内容
const setEditorContent = (editor: EditorView | null, content: string): void => {
  if (!editor) return

  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: content,
    },
  })
}

// 转换函数
const convert = (): void => {
  try {
    const input = getEditorContent(inputEditor)
    if (!input.trim()) {
      throw new Error('请输入有效的 JavaScript 对象')
    }

    const obj = parseInput(input)
    const jsonString = JSON.stringify(obj, null, 2)
    setEditorContent(outputEditor, jsonString)

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

// 复制功能
const copyInput = async (): Promise<void> => {
  const input = getEditorContent(inputEditor)
  await copyToClipboard(input, 'JavaScript 代码已复制')
}

const copyOutput = async (): Promise<void> => {
  const output = getEditorContent(outputEditor)
  if (!output.trim()) {
    message.warning('没有可复制的内容')
    return
  }
  await copyToClipboard(output, 'JSON 内容已复制')
}

const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    message.success(successMessage)
  } catch (err) {
    message.error('复制失败: ' + (err as Error).message)
  }
}

// 清空功能
const clearAll = (): void => {
  setEditorContent(inputEditor, '')
  setEditorContent(outputEditor, '')
  hasInitialContent.value = false
  message.info('已清空所有内容')
}
</script>

<style lang="scss" scoped>
/* 确保编辑器高度正确 */
:deep(.cm-editor) {
  height: 100%;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.tools-card {
  height: 100%;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.n-card.n-card--bordered {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.color-#fff {
  color: #fff;
}
</style>
