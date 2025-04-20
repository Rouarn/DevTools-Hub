<template>
  <NCard class="h-full bg-transparent tools-card" content-class="h-full flex flex-col p-0">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <NIcon color="#fff" :component="CodeWorkingOutline" />
          <span class="color-#fff">{{ title }}</span>
        </div>
        <NButton text @click="handleCopy">
          <template #icon>
            <NIcon color="#fff" :component="CopyOutline" />
          </template>
        </NButton>
      </div>
    </template>
    <div ref="editorRef" class="flex-1 overflow-hidden"></div>
  </NCard>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { EditorView } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'
import { CopyOutline, CodeWorkingOutline } from '@vicons/ionicons5'
import { NIcon, NButton, NCard, useMessage } from 'naive-ui'

const props = defineProps<{
  title: string
  initialContent?: string
  editable?: boolean
  language?: 'javascript' | 'typescript' | 'json'
  onContentChange?: (content: string) => void
}>()

const message = useMessage()
const editorRef = ref<HTMLElement>()
let editor: EditorView | null = null

// 初始化编辑器
onMounted(() => {
  const extensions = [basicSetup, oneDark, EditorView.lineWrapping]

  if (props.language === 'javascript') {
    extensions.push(javascript())
  }

  if (!props.editable) {
    extensions.push(EditorView.editable.of(false))
  }

  if (props.onContentChange) {
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          props.onContentChange?.(getContent())
        }
      }),
    )
  }

  editor = new EditorView({
    doc: props.initialContent || '',
    extensions,
    parent: editorRef.value!,
  })
})

// 获取编辑器内容
const getContent = (): string => {
  return editor?.state.doc.toString() || ''
}

// 设置编辑器内容
const setContent = (content: string): void => {
  if (!editor) return

  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: content,
    },
  })
}

// 复制功能
const handleCopy = async (): Promise<void> => {
  const content = getContent()
  if (!content.trim()) {
    message.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(content)
    message.success('内容已复制')
  } catch (err) {
    message.error('复制失败: ' + (err as Error).message)
  }
}

// 监听内容变化
watch(
  () => props.initialContent,
  (newContent) => {
    if (newContent !== undefined) {
      setContent(newContent)
    }
  },
)

defineExpose({
  getContent,
  setContent,
})
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
</style>
