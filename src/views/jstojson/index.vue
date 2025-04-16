<template>
  <NLayoutContent
    class="flex-1 p-4"
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
      <NButton secondary @click="clearAll">
        <template #icon>
          <NIcon :component="TrashOutline" />
        </template>
        清空
      </NButton>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
      <!-- 输入面板 -->
      <NCard class="h-full" content-class="h-full flex flex-col p-0">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <NIcon :component="CodeWorkingOutline" />
              <span>JavaScript 对象</span>
            </div>
            <NButton text @click="copyInput">
              <template #icon>
                <NIcon :component="CopyOutline" />
              </template>
            </NButton>
          </div>
        </template>
        <div ref="inputEditorRef" class="flex-1 overflow-hidden"></div>
      </NCard>

      <!-- 输出面板 -->
      <NCard class="h-full" content-class="h-full flex flex-col p-0">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <NIcon :component="CodeWorkingOutline" />
              <span>TypeScript 类型</span>
            </div>
            <NButton text @click="copyOutput">
              <template #icon>
                <NIcon :component="CopyOutline" />
              </template>
            </NButton>
          </div>
        </template>
        <div ref="outputEditorRef" class="flex-1 overflow-hidden"></div>
      </NCard>
    </div>
  </NLayoutContent>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EditorView } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'
import { CopyOutline, RefreshOutline, CodeWorkingOutline, TrashOutline } from '@vicons/ionicons5'
import { NIcon, NButton, NCard, NLayoutContent } from 'naive-ui'

// 编辑器实例
const inputEditorRef = ref<HTMLElement>()
const outputEditorRef = ref<HTMLElement>()
let inputEditor: EditorView | null = null
let outputEditor: EditorView | null = null
const hasInitialContent = ref(false)

// 初始化编辑器
onMounted(() => {
  inputEditor = new EditorView({
    doc: '',
    extensions: [
      basicSetup,
      javascript(),
      oneDark,
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
    const result = generateTSInterface(obj)
    setEditorContent(outputEditor, result)

    window.$message.success('转换成功!')
    hasInitialContent.value = true
  } catch (e) {
    window.$message.error((e as Error).message)
  }
}

// 解析输入
const parseInput = (input: string): any => {
  try {
    const cleanInput = input
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
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

  return (
    childInterfaces +
    `${'  '.repeat(depth - 1)}interface ${interfaceName} {\n${fields.join('\n')}\n${'  '.repeat(
      depth - 1,
    )}}`
  )
}

// 辅助函数
const getType = (value: any): string => {
  if (value === null) return 'null'
  if (value instanceof Date) return 'Date'

  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    undefined: 'undefined',
  }
  return typeMap[typeof value] || 'any'
}

const getInterfaceName = (parentName: string, key: string): string => {
  const validKey = key.toString().replace(/[^a-zA-Z0-9]/g, '_')
  return `${parentName}_${pascalCase(validKey)}`
}

const pascalCase = (str: string): string => {
  if (!str) return 'Unknown'
  return String(str)
    .split(/_|-| /)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const formatKey = (key: string): string => {
  return /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `'${key}'`
}

// 复制功能
const copyInput = async (): Promise<void> => {
  const input = getEditorContent(inputEditor)
  await copyToClipboard(input, 'JavaScript 代码已复制')
}

const copyOutput = async (): Promise<void> => {
  const output = getEditorContent(outputEditor)
  if (!output.trim()) {
    window.$message.warning('没有可复制的内容')
    return
  }
  await copyToClipboard(output, 'TypeScript 类型已复制')
}

const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    window.$message.success(successMessage)
  } catch (err) {
    window.$message.error('复制失败: ' + (err as Error).message)
  }
}

// 清空功能
const clearAll = (): void => {
  setEditorContent(inputEditor, '')
  setEditorContent(outputEditor, '')
  hasInitialContent.value = false
  window.$message.info('已清空所有内容')
}
</script>

<style>
/* 确保编辑器高度正确 */
.cm-editor {
  height: 100%;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 暗色模式适配 */
.n-config-provider {
  height: 100%;
}

/* 编辑器容器样式 */
.cm-editor-container {
  height: 100%;
  overflow: hidden;
}
</style>
