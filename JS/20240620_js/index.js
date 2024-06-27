// 設定 Express 應用程式中處理 CRUD（新增、讀取、更新、刪除）操作的語法
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import User from './user.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 連線到資料庫
// connect 是 promise語法，要寫await 或 then
// 使用立即執行語法
// 第一個()定義function，第二個()是呼叫function
// (async()=>{
//     await mongoose.connect(process.env.DB_URL)
// })
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.error(error)
  })

// 建立網頁伺服器
// express語法順序會有影響
const app = express()

// 先解析body再處理請求
// 將傳入的 body 解析為可以用的 json
app.use(express.json())

// 處理express.json 的錯誤
// 處理 middleware 的錯誤一定要有四個參數 error, req, res, next
// req, res 處理請求
// next 為 middleware 處理完東西到下一步
// error 錯誤訊息 處理前一個 middleware 發生的錯誤
// _ 忽略參數不用
app.use((_, req, res, next) => {
  // json格式錯誤，明顯為使用者問題，故錯誤代碼400
//   res.status(400).json({
  res.status(StatusCodes.BAD_REQUEST).json({ // 數字變文字 (好閱讀)
    success: false,
    message: '資料格式錯誤'
  })
})

// 請求的處理
// app.請求方式(路徑, 處理function)
// req進來的資料，res回傳的資料
// 使用 try...catch 塊來捕獲可能發生的異常
// 對資料庫的操作因為會有延遲，所以用async
// 新增
app.post('/', async (req, res) => {
  try {
    console.log(req.body)

    // const user = new User({
    // account: req.body.account,
    //   email: req.body.email})
    // user.save()

    // const user = await User.create({
    //   account: req.body.account,
    //   email: req.body.email
    // })
    // await user.save()

    // 等待建立完的結果
    const user = await User.create(req.body)
    // res.status()  回傳狀態碼
    // res.send() 回傳文字、json

    // 上面兩個合併
    // 回傳的東西只能出現一次，否則第二個會出錯
    // res.status(200).json({
    res.status(StatusCodes.OK).json({ // 200 -> StatusCodes.OK
      success: true, // 是否成功
      message: '', // 有無錯誤訊息
      result: user // 這次結果
    })

    // 錯誤處理，根據錯誤的類型做不同處理
  } catch (error) {
    console.log(error)
    // 檢查錯誤的類型是否為 MongoServerError，且錯誤代碼是 11000
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // 資料重複 unique 錯誤
    //   res.status(409).json({
      res.status(StatusCodes.CONFLICT).json({ // 409 -> StatusCodes.CONFLICT
        success: false, // 是否成功
        message: '帳號或信箱重複' // 有無錯誤訊息
      })
    } else if (error.name === 'ValidationError') {
      // 驗證錯誤
      // 第一個驗證失敗的欄位名稱
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message

      res.status(StatusCodes.BAD_REQUEST).json({ // 400 -> BAD_REQUEST
        success: false,
        message
      })
    } else { // 其他想不到的錯誤
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ // 500 -> INTERNAL_SERVER_ERROR
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

// 查詢
app.get('/', async (req, res) => {
  try {
    // .find() 指查詢條件，找到會用陣列回傳，沒寫就是沒條件
    const result = await User.find()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ // 500 -> INTERNAL_SERVER_ERROR
      success: false,
      message: '未知錯誤'
    })
  }
})

// 把/後面的東西抓下來給他一個名字(id 自取)
app.get('/:id', async (req, res) => {
  console.log('id', req.params.id)
  console.log('query', req.query) // 放查詢過濾的條件比較多 查詢條件?

  try {
    // 此段在驗證 id 參數是否符合 mongoDB 的格式
    // throw 手動拋出錯誤
    // new Error('ID') 創建了一個新的 Error 物件，並且 'ID' 是這個錯誤物件的訊息
    // 沒有 Error('ID') 的話，就會 Cast Error
    if (!validator.isMongoId(req.params.id)) throw new Error('ID') // 上下要一樣 153行
    // const user = await User.find({ _id: req.req.params.id })
    // const user = await User.findOne({_id: req.req.params.id})
    const user = await User.findById(req.params.id)

    // 如果沒有user，拋出一個錯誤
    if (!user) throw new Error('NOT FOUND') // 上下要一樣 158行
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: user
    })
    // 通過檢查 error.message 是否等於 'ID' 來區分這種特定的錯誤類型（ID 格式錯誤），並根據這個情況返回相應的 HTTP 狀態碼和錯誤訊息
  } catch (error) {
    console.log(error)
    // 代表mongodb格式不對
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無資料'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

// 刪除
app.delete('/:id', async (req, res) => {
  try {
    // 跟id有關的都可能發生錯誤
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    const user = await User.findByIdAndDelete(req.params.id) // 被刪除的那筆資料

    if (!user) throw new Error('NOT FOUND')
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無資料'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

// 更新 patch把一部分欄位改掉，put整組換掉，老師習慣用patch
app.patch('/:id', async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    // id、要放的東西、更新動作的設定
    // user 預設是更新之前的內容，加 { new: true } 才會回傳更新後的資料
    // runValidators: true 執行 schema 定義的驗證
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!user) throw new Error('NOT FOUND')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: user
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      // 資料重複 unique 錯誤
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號或信箱重複'
      })
    } else if (error.name === 'ValidationError') {
      // 驗證錯誤
      // 第一個驗證失敗的欄位名稱
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無資料'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
