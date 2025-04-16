<script setup lang="ts"></script>

<template>
  <div class="h-100px pos-relative">
    <section
      class="w-full h-70%! z-40 rounded-3xl outline-white/10 md:rounded-xl bg-black md:bg-[#000000C4] backdrop-blur-sm md:transition-all top-6 px-30"
      style="
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        transition-duration: 300ms;
        font-size: 14px;
        height: auto;
        position: absolute;
      "
    >
      <NSpace class="px-6 h-full" justify="space-between" align="center">
        <div
          class="w-fit h-full flex flex-shrink-0 items-center justify-start"
          style="max-width: 300px"
        >
          <NImage
            alt="logo"
            class="_editable-img_9w82j_95 !w-auto !max-w-[300px] object-cover flex-shrink-0 min-w-0"
            data-element-type="image"
            data-prop-key="logo"
            data-type="image"
            style="height: 40px; background-color: transparent"
            src="logo.png"
          />
        </div>
        <NSpace class="h-full">
          <NButton class="text-white"> 主页 </NButton>
          <NButton class="text-white"> 工具页 </NButton>
          <NButton class="text-white"> 关于我们 </NButton>
        </NSpace>
      </NSpace>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
