import axios from 'axios'

// 有設，省code，相對路徑
// baseURL = http://localhost:4000
// axios.post('/user')

// 沒設
// baseURL = x
// axios.post('http://localhost:4000/user')

// 建立一個axios東西，.create建立一份新的axios的東西出來，可以調整預設設定
const api = axios.create({
  // 設定基準的網址，可以設成後端的API
  baseURL: import.meta.VITE_API
})

export const useApi = () => {
  return { api }
}
