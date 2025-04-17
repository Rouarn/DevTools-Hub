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
                <span class="color-#fff">TypeScript 类型</span>
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
import { defaultKeymap } from '@codemirror/commands'
import {
  CopyOutline,
  RefreshOutline,
  CodeWorkingOutline,
  TrashOutline,
  ArrowUpCircleOutline,
} from '@vicons/ionicons5'
import { NIcon, NButton, NCard, NLayoutContent, useMessage, NScrollbar, NFlex } from 'naive-ui'

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
    extensions: [oneDark, EditorView.editable.of(false), EditorView.lineWrapping],
    parent: outputEditorRef.value!,
  })
})

// 获取编辑器内容
const getEditorContent = (editor: EditorView | null): string => {
  return editor?.state.doc.toString() || ''
}

// 设置编辑器内容
const setEditorContent = (editor: EditorView | null, content: string): void => {
  editor?.dispatch({
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
    if (!input.trim()) throw new Error('请输入有效的 JavaScript 对象')

    const obj = parseInput(input)
    const result = generateTSInterface(obj)
    setEditorContent(outputEditor, result)

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

    if (typeof obj !== 'object' || obj === null) throw new Error('请输入有效的 JavaScript 对象')
    return obj
  } catch (e) {
    throw new Error('解析失败: ' + (e as Error).message)
  }
}

// 生成TS接口
const generateTSInterface = (obj: any, interfaceName = 'GeneratedType', depth = 1): string => {
  let childInterfaces = ''
  const indent = '  '.repeat(depth)

  const processValue = (value: any, key: string): string => {
    if (Array.isArray(value)) {
      const elemType = value.length > 0 ? getType(value[0]) : 'any'
      return `${elemType}[]`
    }

    if (typeof value === 'object' && value !== null) {
      const nestedName = getInterfaceName(interfaceName, key)
      childInterfaces += generateTSInterface(value, nestedName, depth + 1) + '\n\n'
      return nestedName
    }

    return getType(value)
  }

  const fields = Object.entries(obj).map(([key, value]) => {
    const type = processValue(value, key)
    return `${indent}${formatKey(key)}: ${type};`
  })

  return `${childInterfaces}${'  '.repeat(depth - 1)}interface ${interfaceName} {\n${fields.join('\n')}\n${'  '.repeat(depth - 1)}}`
}

// 类型辅助函数
const getType = (value: any): string => {
  if (value === null) return 'null'
  if (value instanceof Date) return 'Date'

  const typeMap: { [key: string]: string } = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    object: 'object', // 处理非空对象
    function: 'Function', // 处理函数类型
    undefined: 'undefined', // 处理未定义类型
    symbol: 'Symbol', // 处理符号类型
    bigint: 'BigInt', // 处理大整数类型
  }

  return typeMap[typeof value] || 'any' // 默认返回 'any'
}

const getInterfaceName = (parentName: string, key: string): string => {
  const validKey = key.replace(/[^a-zA-Z0-9]/g, '_')
  return `${parentName}_${validKey
    .split(/[-_ ]/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('')}`
}

const formatKey = (key: string): string => (/^[a-zA-Z_$][\w$]*$/.test(key) ? key : `'${key}'`)

// 剪贴板操作
const copyInput = async () => {
  const input = getEditorContent(inputEditor)
  if (!input) return message.warning('没有可复制的内容')
  try {
    await navigator.clipboard.writeText(input)
    message.success('已复制 JavaScript 代码')
  } catch (err) {
    message.error('复制失败: ' + (err as Error).message)
  }
}

const copyOutput = async () => {
  const output = getEditorContent(outputEditor)
  if (output) {
    try {
      await navigator.clipboard.writeText(output)
      message.success('已复制 TypeScript 类型')
    } catch (err) {
      message.error('复制失败: ' + (err as Error).message)
    }
  } else {
    message.warning('没有可复制的内容')
  }
}

// 清空功能
const clearAll = () => {
  setEditorContent(inputEditor, '')
  setEditorContent(outputEditor, '')
  hasInitialContent.value = false
  message.info('已清空所有内容')
}
</script>

<style lang="scss" scoped>
.tools-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.cm-editor) {
  height: 100%;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  padding: 12px;

  &.cm-focused {
    outline: none;
  }

  .cm-gutters {
    background: rgba(255, 255, 255, 0.02);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .cm-lineNumbers .cm-gutterElement {
    color: rgba(255, 255, 255, 0.3);
  }
}

.n-card-header {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
