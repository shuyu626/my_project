import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const cartSchema = Schema({
  // product 所以用p開頭
  p_id: {
    type: ObjectId, // mongoose來的
    // id從products來的，建立文件間的關聯
    ref: 'products',
    required: [true, '使用者購物車商品必填']
  },
  //   數量
  quantity: {
    type: Number,
    required: [true, '使用者購物車商品數量必填'],
    min: [1, '使用者購物車商品數量不符']
  }
})

const schema = new Schema({
  account: {
    type: String,
    required: [true, '使用者帳號必填'],
    minlength: [4, '使用者帳號長度不符'],
    maxlength: [20, '使用者帳號長度不符'],
    unique: true,
    // 自訂驗證function
    // Alpha 是指字母 anumeric 是指數字
    validate (value) {
      return validator.isAlphanumeric
    },
    message: '使用者帳號格式錯誤'
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
  },
  email: {
    type: String,
    required: [true, '使用者信箱必填'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [cartSchema]
  },
  role: {
    // 設定role的資料欄位型態是數字，預設值是useRole的USER，增加可讀性
    type: Number,
    default: UserRole.USER
  }
}, {
  // 更新時間
  timestamps: true,
  // 文建中的__v欄位，追蹤版本
  versionKey: false
})

// 保存之前執行function
schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4 || user.password.length > 20) {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '使用者密碼長度不符' }))
      next(error)
      return
    } else {
      // 加密，加鹽10次
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

// 建立虛擬屬性（virtual property）來計算使用者購物車中所有商品的總數量
// schema.virtual()建立虛擬的欄位叫cartQuantity，定義資料怎麼產生，可以寫被修改的時候要幹嘛
schema.virtual('cartQuantity').get(function () {
  // 箭頭函式沒有this，會取不到使用者資料
  const user = this // this指現在的使用者資料
  //  total加到的東西，current跑到哪
  return user.cart.reduce((total, current) => {
    return total + current.quantity // 累加數量
  }, 0)
})

export default model('users, schema')
