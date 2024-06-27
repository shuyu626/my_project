import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import routeUser from './routes/user.js'
import routeProduct from './routes/product.js'

// 當客戶端發送一個包含使用者資訊的 POST 請求時，
// Express 框架會使用 express.json() 中介軟體解析請求的 JSON 資料，
// 並將解析後的資料存放在 req.body 中

// 建立express伺服器
const app = express()

// 處理請求的 JSON 解析和錯誤處理
// 把get、post...的body解析成json，格式可能會有錯誤，所以要寫錯誤處理
// express.json() 放在所有路由之前，確保每個請求的 JSON 資料都能正確地被解析和使用
app.use(express.json())
// express function 用參數處理，第一個參數原為error，但有錯誤為json格式問題，沒辦法處理所以用_
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

// 所有進到 user 路徑的請求，全部交給user的路由處理
app.use('/user', routeUser) // from routes > user.js
app.use('/product', routeProduct)

// 在本機沒有process.env.PORT，所以在4000
app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  //   建立 mongoose 連線
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})
