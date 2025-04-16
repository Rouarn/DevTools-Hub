// 引入必要的模块
import { defineConfig } from '@unocss/vite'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import presetWind3 from '@unocss/preset-wind3'
import type { Theme } from '@unocss/preset-uno'
import { presetSoybeanAdmin } from './src/theme/uno-preset'
import { themeVars } from './src/theme/vars'

// 配置 UnoCSS
export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'], // 排除不必要的文件夹
    },
  },
  theme: {
    ...themeVars, // 扩展自定义主题变量
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem',
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm', // 快捷类名
  },
  transformers: [transformerDirectives(), transformerVariantGroup()], // 转换器
  presets: [presetWind3({ dark: 'class' }), presetSoybeanAdmin()], // 预设
})
