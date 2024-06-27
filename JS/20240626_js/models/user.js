import { Schema, model, Error } from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '使用者名稱必填'],
    unique: true
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
  },
  //   大頭貼
  avatar: {
    type: String,
    // 預設值
    default () {
      // this.name 指向同一個資料的 name 欄位
      // 根據文件中的 name 欄位來動態生成一個預設的頭像連結
      return `https://api.multiavatar.com/${this.name}` // 第5行
    }
  },
  //   放使用者登入驗證的東西，使用者要用序號去要東西，這樣就知道他是誰，確認是否有權限
  tokens: {
    type: [String] // 文字陣列的意思，不用另建schema // 在typescript 代表陣列裡面只有一個文字
  }
})

// 資料驗證完後，寫入資料庫前，用於在保存（save）資料之前，對密碼進行格式驗證和加密的過程
schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) { // 確認密碼是否修改
    if (user.password.length > 0) { // 確認是否符合驗證
      user.password = bcrypt.hashSync(user.password, 10) // 加密
    } else {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidationError({ message: '使用者密碼必填' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
