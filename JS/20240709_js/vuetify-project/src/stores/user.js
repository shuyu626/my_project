// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole.js'
import { useApi } from '@/composables/axios'

// 定義使用者狀態管理的 Pinia store
export const useUserStore = defineStore('user', () => {
  const { api, apiAuth } = useApi()// 使用 useApi 自訂鉤子獲取非授權 API 實例

  // 定義使用者相關的狀態
  const token = ref('') // 使用 ref 創建一個 token 的 reactive 狀態
  const account = ref('') // 使用 ref 創建一個 account 的 reactive 狀態
  const role = ref(UserRole.USER) // 使用 ref 創建一個 role 的 reactive 狀態，預設為 UserRole.USER
  const cart = ref(0) // 使用 ref 創建一個 cart 的 reactive 狀態，預設為 0

  // 判斷是否已登入
  const isLogin = computed(() => {
    return token.value.length > 0
  })
  // 判斷是否為管理員角色
  const isAdmin = computed(() => {
    return role.value === UserRole.ADMIN
  })

  // 用於發送登入請求到後端 API
  const login = async (values) => {
    try {
      // 發送 POST 請求到 /user/login 路徑
      const { data } = await api.post('/user/login', values)
      token.value = data.result.token
      account.value = data.result.account
      role.value = data.result.role
      cart.value = data.result.cart
      return '登入成功'
    } catch (error) {
      console.log(error)
      return error?.response?.data?.message || '發生錯誤，請稍後再試'
    }
  }

  const profile = async () => {
    if (!isLogin.value) return

    try {
      const { data } = await apiAuth.get('/user/profile')
      account.value = data.result.account
      role.value = data.result.role
      cart.value = data.result.cart
    } catch (error) {
      token.value = ''
      account.value = ''
      role.value = UserRole.USER
      cart.value = 0
    }
  }

  const logout = async () => {
    try {
      await apiAuth.delete('/user/logout')
    } catch (error) {
      console.log(error)
    }
    token.value = ''
    account.value = ''
    role.value = UserRole.USER
    cart.value = 0
  }

  return {
    token,
    account,
    role,
    cart,
    isLogin,
    isAdmin,
    login,
    profile,
    logout
  }
}, {
  persist: {
    key: 'shop',
    paths: ['token']
  }
})
