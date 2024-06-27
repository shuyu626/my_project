// 定義login驗證方式

import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

// 使用驗證策略寫自己的驗證方式
// passport.use(驗證方式,驗證策略)
// new passportLocal.Strategy({}) 用於處理使用者名稱和密碼進行身份驗證的內建策略
passport.use('login', new passportLocal.Strategy({
  // 修改資料欄位，預設是 username帳號 和 password密碼 欄位
  // 使用 usernameField 和 passwordField 修改驗證欄位
  // 檢查有沒有這兩個欄位，檢查完跟資料庫比對(要自己寫)
  usernameField: 'name', // 身份驗證時，Passport 將從請求中讀取 'name' 欄位來獲取用戶名稱
  passwordField: 'password' // 身份驗證時，Passport 將從請求中讀取 'password' 欄位來獲取用戶密碼
  // (usernameField 收到的資料, passwordField 收到的資料, 進去下一步的意思)
  // 執行驗證策略，執行後面funcion，在到middleware(auth.js)，執行失敗就直接進middleware(auth.js)
}, async (name, password, done) => {
  // 驗證策略執行成功後的 function
  // passportLocal 成功的條件是進來的資料有指定欄位

  try {
    // 查詢有沒有符合名字的使用者
    // { name: name } key跟value一樣的話可省略 => { name }
    const user = await User.findOne({ name })
    if (!user) throw new Error('NAME')

    // 檢查密碼
    if (!bcrypt.compareSync(password, user.password)) throw new Error('PW')

    // 驗證完成，下一步
    // done(錯誤, 資料, info)
    return done(undefined, user, undefined)
  } catch (error) {
    console.log(error)
    if (error.message === 'NAME') {
      return done(undefined, undefined, { message: '帳號不存在' })
    } else if (error.message === 'PW') {
      return done(undefined, undefined, { message: '密碼錯誤' })
    } else {
      return done(undefined, undefined, { message: '未知錯誤' })
    }
  }
}))

// 使用 Passport 中的 use 方法來設定一個名為 'jwt' 的策略
// 使用了 PassportJWT 提供的 Strategy 類別來設定 JWT 策略。
passport.use('jwt', new passportJWT.Strategy({
  // 設定擷取 JWT 的位置
  // fromAuthHeaderAsBearerToken() 方法表示 JWT 將從 HTTP 請求的 Authorization header 中的 Bearer token 中提取
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 用於驗證 JWT 的密鑰 secret
  secretOrKey: process.env.JWT_SECRET,
  // 無法取得使用者用甚麼jwt來發請求，所以要用 passReqToCallback，後面就多req可以用
  passReqToCallback: true // 有設定後面才能使用req
  // 當 JWT 驗證成功時被調用
}, async (req, payload, done) => {
  // req 請求資訊，有設定 passReqToCallback 才能用
  // payload 解析後的內容 (簽甚麼出去_id就會解到甚麼資料)
  // done 下一步
  try {
    // 因為沒有辦法取的原始 JWT，所以需要自己想辦法
    // const token = req.headers.authorization.split(' ')[1] // ('裡面有空白') 很重要
    // 從請求中提取 JWT，這裡使用了 Passport-JWT 提供的方法來從 Authorization header 的 Bearer token 中提取 JWT
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    // 查詢有沒有使用者，符合解析出的 id，且有這個 jwt
    // 查詢使用者，條件是使用者的 _id 符合 payload 中的 _id，且 tokens 中包含解析出的 token
    const user = await User.findOne({ _id: payload._id, tokens: token })
    // 如果找不到符合條件的使用者，拋出一個自定義的錯誤
    if (!user) throw new Error('JWT')
    // 如果成功找到使用者，調用 done 回調函數，並傳遞使用者資料和 token
    return done(undefined, { user, token }, undefined)
  } catch (error) {
    console.log(error)
    if (error.message === 'JWT') {
      // 如果是因為找不到符合條件的使用者，調用 done 回調函數，並傳遞 undefined 表示認證失敗，並且提供一個自定義的訊息對象
      return done(undefined, undefined, { message: '' })
    } else {
      // 如果是其他未知錯誤，也調用 done 回調函數，並傳遞 undefined 表示認證失敗，並且提供一個未知錯誤的訊息對象
      return done(undefined, undefined, { message: '未知錯誤' })
    }
  }
}))
