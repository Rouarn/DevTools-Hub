<script setup lang="ts">
defineOptions({
  name: 'GlobalContent',
})

interface Props {
  /** Show padding for content */
  showPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  showPadding: true,
})
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style></style>
