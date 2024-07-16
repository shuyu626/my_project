// 設置和使用帶有 JWT 認證的 API 請求

import axios from 'axios'
import { useUserStore } from '@/stores/user'

// baseURL = http://localhost:4000
// axios.post('/user')
// baseURL = x
// axios.post('http://localhost:4000/user')

// 創建一個 axios 實例，設定基本 URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 創建另一個 axios 實例，用於需要認證的請求
const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 1. axios.get / axios.post ...
// 2. interceptors.request
// 3. 送出
// 4. interceptors.response
// 5. .then() .catch()

// config 當次請求設定
// 攔截器送出的時候會自動加上jwt驗證
// 在每個 apiAuth 的請求中自動添加 Authorization 標頭，包含使用者的 JWT
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

// 1. apiAuth.get(/user/profile)
// 2. apiAuth.interceptors.request  自動加上 JWT
// 3. 傳送出去
// 4. apiAuth.interceptors.response(成功處理, 失敗處理)
// 5. 如果成功，回傳收到的資料，結束
// 6. 如果失敗，且是登入過期，自動傳送舊換新
// 7. 舊換新成功，修改 apiAuth.get(/user/profile) 的 jwt 後重新送出
// 8. 舊換新失敗，回傳 apiAuth.get(/user/profile) 的錯誤

// 處理 apiAuth 的回應，分別處理成功和失敗的情況
// res 代表回來的請求
apiAuth.interceptors.response.use(res => {
  return res
  // 失敗的話加第二個參數
  // 錯誤401可能代表token過期
}, async error => {
  // 判斷是否有回應(網路斷掉?)
  // 如果失敗有回應 (網路斷線也算是失敗，網路斷線不會有回應)
  if (error.response) {
    // 如果得到登入過期的回應訊息，且不是舊換新
    if (error.response.data.message === '登入過期' && error.config.url !== '/user/extend') {
      const user = useUserStore()
      try {
        // 傳送舊換新請求 (發送請求以刷新 token)
        const { data } = await apiAuth.patch('/user/extend')
        // 舊換新成功，更新 store 的 token
        user.token = data.result
        // 修改原本發生錯誤的請求的設定 (修改原始請求的 Authorization 標頭並重新發送請求)
        error.config.headers.Authorization = 'Bearer ' + user.token
        // 重新傳送一次原本的請求
        return axios(error.config)
      } catch (_) {
        // 舊換新錯誤，登出
        user.logout()
      }
    }
  }
  // 回傳原本請求的錯誤到呼叫 apiAuth 的地方
  return Promise.reject(error)
})

export const useApi = () => {
  return { api, apiAuth }
}
