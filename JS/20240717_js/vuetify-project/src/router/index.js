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
  extendRoutes: setupLayouts // 自動生成的佈局配置
})

// 路由守衛頁面阻擋
router.beforeEach(async (to, from, next) => {
  const user = useUserStore() // 取得使用者資料

  // 如果從 START_LOCATION（可能是應用程序的初始位置）導航，則呼叫 user.profile() 方法來獲取使用者資料。
  if (from === START_LOCATION) {
    await user.profile()
  }

  if (user.isLogin && ['/register', '/login'].includes(to.path)) {
    next('/')// 重新導向到首頁
  } else if (to.meta.login && !user.isLogin) {
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    next('/')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
