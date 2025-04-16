/// <reference types="vite/client" />
export {}

declare global {
  interface Window {
    $notification: NotificationApiInjection
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    $loadingBar: LoadingBarApiInjection
    utools: utools
  }
}
