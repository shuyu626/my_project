import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 進入頁面就引用
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // meta資料可以隨意寫
      meta: {
        title: '國家公園介紹網'
      }
    },
    {
      path: '/yangminshan',
      name: 'yangminshan',
      // 動態引用 YangMingShanView.vue 檔案，執行function才引用
      component: () => import('@/views/YangMingShanView.vue'),
      // redirect: 'https://google.com' 不一定要有元件
      meta: {
        title: '陽明山'
      }
      // 進去這頁之前可做一些操作，可擋人(沒有會員就不能用等等)
      // beforeEnter () {

      // }
    }
  ]
})
// ### 導航守衛
// 進入每一頁前
// to = 目標頁面
// from = 來源頁面
// next = 重新導向或繼續
router.beforeEach((to, from, next) => {
  if (to.name !== 'home') {
    const input = prompt('輸入密碼')
    if (input === '123') {
      // next() 原本想去哪就去哪
      next()
    } else {
      // next() 有放東西，代表重新導向到指定的地方
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

// 進入每一頁後執行
// to = 目標頁面 去哪
// from = 來源頁面 從哪來
router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
