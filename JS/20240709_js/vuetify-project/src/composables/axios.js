import axios from 'axios'
import { useUserStore } from '@/stores/user'

// baseURL = http://localhost:4000
// axios.post('/user')
// baseURL = x
// axios.post('http://localhost:4000/user')

// 使用 Axios 庫來創建兩個不同的 API 客戶端實例，並設置了一個請求攔截器用於身份驗證
const api = axios.create({
  baseURL: import.meta.env.VITE_API
})
const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 1. axios.get / axios.post ...
// 2. interceptors.request
// 3. 送出
// 4. interceptors.response
// 5. .then() .catch()

// config這次請求的設定，目標網址、請求方式等等
apiAuth.interceptors.request.use(config => {
  const user = useUserStore() // 要放裡面
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

export const useApi = () => {
  return { api, apiAuth }
}
