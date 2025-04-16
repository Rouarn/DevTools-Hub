<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { useSvgIcon } from '@/hooks/common/icon';
import { $t } from '@/locales';

defineOptions({
  name: 'UserAvatar'
});

const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { SvgIconVNode } = useSvgIcon();

function loginOrRegister() {
  toLogin();
}

type DropdownKey = 'logout';

type DropdownOption =
  | {
      key: DropdownKey;
      label: string;
      icon?: () => VNode;
    }
  | {
      key: string;
      label: string;
      icon?: () => VNode;
    };

const options = computed(() => {
  let opts: DropdownOption[] = [
    {
      label: $t('common.switchSystem'),
      key: 'switchFrontEnd',
      icon: SvgIconVNode({ icon: 'mdi:nintendo-switch', fontSize: 18 })
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ];

  if (appStore.isClient && route.path.includes(import.meta.env.VITE_ROUTE_FRONTEND)) {
    opts = opts.filter(item => item.key !== import.meta.env.VITE_ROUTE_FRONTEND);
    opts.unshift({
      label: $t('common.controlConsole'),
      key: 'frontend-console',
      icon: SvgIconVNode({ icon: 'mdi:console', fontSize: 18 })
    });
  }
  if (appStore.isClient && route.path.includes(import.meta.env.VITE_ROUTE_FRONTEND_CONSOLE)) {
    opts = opts.filter(item => item.key !== import.meta.env.VITE_ROUTE_FRONTEND_CONSOLE);
    opts.unshift({
      label: $t('route.frontend_list'),
      key: 'frontend',
      icon: SvgIconVNode({ icon: 'mdi:nintendo-switch', fontSize: 18 })
    });
  }
  return opts;
});
function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore();
    }
  });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else if (key === 'switchFrontEnd') {
    appStore.toggleClient();
  } else if (key === 'frontend-console') {
    routerPushByKey(key);
  } else {
    // If your other options are jumps from other routes, they will be directly supported here
    routerPushByKey(key);
  }
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div>
      <ButtonIcon>
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
