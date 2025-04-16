<script setup lang="ts">
import GlobalContent from '@/layouts/modules/global-content/index.vue'
import GlobalHeader from '@/layouts/modules/global-header/index.vue'
import GlobalFooter from '@/layouts/modules/global-footer/index.vue'

defineOptions({
  name: 'BlankLayout',
})
</script>

<template>
  <NLayout class="h-full" :native-scrollbar="false" content-class="flex flex-col h-full">
    <NLayoutHeader position="static" class="bg-transparent">
      <GlobalHeader />
    </NLayoutHeader>
    <NLayoutContent class="flex-1 bg-transparent ma-4">
      <GlobalContent :show-padding="false" class="w-full h-full" />
    </NLayoutContent>
    <NLayoutFooter position="static" class="bg-transparent">
      <GlobalFooter />
    </NLayoutFooter>
  </NLayout>
</template>

<style lang="scss" scoped></style>
