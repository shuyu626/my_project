import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import routeUser from './routes/user.js'

const app = express()

// 習慣放第一個，因為超出上限就不需要處理進來的請求，避免浪費資源
// 設定15分鐘內最多 100 個請求
app.use(rateLimit({
  windowMs: 1000 * 60 * 15, // 限制時間為 15 分鐘
  max: 100, // 在限制時間內，最多允許 100 次請求
  // 設定header回應，預設
  standardHeaders: 'draft-7', // 使用標準的 HTTP 標頭格式
  legacyHeaders: false, // 不使用舊版的 HTTP 標頭格式
  statusCode: StatusCodes.TOO_MANY_REQUESTS, // 請求過多的 HTTP 狀態碼為 429
  message: '太多請求', // 錯誤訊息為 "太多請求"
  // 當超過限制時的回應
  // handler 設定怎麼回應訊息，options得到上面的設定值
  handler (req, res, next, options) {
    res.status(options.statusCode).json({
      success: false,
      message: options.message
    })
  }
}))

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

// 注意順序問題
app.use(mongoSanitize())

// 當有請求到達伺服器且請求的 URL 是以 /user 開頭時，就會調用 routeUser 中定義的路由處理邏輯來處理這個請求
app.use('/user', routeUser)

// 設定了一個路由處理程序，處理所有 HTTP 方法
app.all('*', routeUser)

// 處理所有未知路徑的請求，並回傳一個明確的錯誤訊息給用戶端
app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到'
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
