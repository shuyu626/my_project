/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()
  // 進頁面的初次導航
  // 換頁不算
  if (from === START_LOCATION) {
    await user.profile()
  }
  // 可以在這個時機向使用者拿資料
  // 一定要呼叫next繼續執行下一頁
  next()
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
