import { Schema, model, Error, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

// cart 是一個陣列，是一個 Schema 的格式
// 購物車中的商品項目
const cartSchema = new Schema({
  // 商品(product)的 id
  p_id: {
    // mongoDB 底下的 id
    type: ObjectId,
    // ID 的來源是 proucts collection
    // ref 做關聯
    ref: 'products', //  告訴 Mongoose 這個 p_id 屬性引用（關聯）了另一個名為 'products' 的集合（或模型），這樣可以建立資料間的關係
    // p_id 是必需的，如果缺少會拋出錯誤，並跳錯誤訊息
    required: [true, '使用者購物車商品 ID 必填']
  },
  //   商品數量
  quantity: {
    type: Number,
    required: [true, '使用者購物車商品數量必填'],
    min: [1, '使用者購物車商品數量ㄅ']
  }
})

const schema = new Schema({
  email: {
    type: String,
    required: [true, '使用者信箱必填'],
    // 不能重複
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
    // 不知道密碼加密後會幾個字，若定義 maxLength 超過限制字數就會寫不進去
    // base64 編碼類型，非加密
  },
  cart: {
    type: [cartSchema]
  }
// 第一個 - 設定會不會出現__v， 第二個 - 建立兩個欄位 (建立時間、更新時間)
}, { versionKey: false, timestamps: true })

// 是一個 Mongoose middleware，用於在保存（save）資料之前，對密碼進行格式驗證和加密的過程
// 資料驗證完後，寫入資料庫前
schema.pre('save', function (next) {
  // this 代表要保存的資料，不能用箭頭函式
  const user = this
  // 如果密碼欄位有被修改
  // isModified 用於檢查 password 是否被修改過
  if (user.isModified('password')) {
    // 驗證密碼格式
    // 如果密碼符合這個條件，則進行加密
    if (user.password.length >= 4 && user.password.length <= 20) {
      // 驗證成功就加密
      //   hashSync: bcrypt 提供的同步函數，用於將明文密碼加密成 bcrypt 雜湊值
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      // 驗證失敗，手動產生一個 mongoose 驗證錯誤
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度不正確' }))
      // 繼續下一步，帶出錯誤，停止保存
      next(error)
      return // 以後都不執行 有問題就return
    }
  }
  // ★★一定要加 next()★★
  // 沒問題的話繼續下一步
  // middleware 重要的 function，有這個才會執行到下一步，只能用一次
  next()
})

// 轉成可以操作的model
export default model('users', schema)
