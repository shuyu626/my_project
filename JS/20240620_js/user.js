import { Schema, model } from 'mongoose'
import validator from 'validator'

// 定義一筆使用者資料要放哪些資料，可寫驗證
const schema = new Schema({
  // 設定資料欄位名稱
  account: {
    // 設定資料型態
    type: String,
    // 必填
    required: [true, '帳號必填'],
    // 文字長度
    minLength: [4, '帳號最少 4 個字'],
    maxLength: [20, '帳號最長 20 個字'],
    // 欄位資料不可重複
    unique: true,
    // Regex 正則表達式
    match: [/^[A-Za-z1-9]+$/, '帳號只能是英數字'],
    // 自動使用 文字，trim() 去除前後空白
    trim: true
  },
  email: {
    type: String,
    required: [true, '信箱必填'],
    unique: true,
    // 自訂驗證
    validate: {
      // 自訂的驗證 function
      validator (value) { // (validator是mongoose來的)
        return validator.isEmail(value) // 使用 validator.isEmail 方法來驗證信箱格式
      },
      // 自訂驗證錯誤訊息
      message: '信箱格式錯誤' // 當驗證失敗時顯示的錯誤訊息
    }
  }
})

// 將資料結構轉成可以操作的 model 物件匯出
// model(collection名稱, schema)
export default model('users', schema)
