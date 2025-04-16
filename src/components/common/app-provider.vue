<script setup lang="ts">
defineOptions({
  name: 'AppProvider',
})
</script>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <slot></slot>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<style lang="scss" scoped></style>
