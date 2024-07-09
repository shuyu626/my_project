import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

// Passport.js 的本地策略（Local Strategy）來實現使用者登入的身份驗證功能
// 定義策略配置
passport.use('login', new passportLocal.Strategy({
  // 檢查兩個欄位，以下為修改欄位的名稱(檢查是否有這兩個欄位)
  usernameField: 'account',
  passwordField: 'password'
//   檢查通過後，接收使用者輸入的帳號和密碼
}, async (account, password, done) => {
  try {
    // 使用輸入的帳號從資料庫中查找使用者
    const user = await User.findOne({ account })
    if (!user) {
      throw new Error('ACCOUNT')
    }
    // 使用 bcrypt.compareSync 方法比對密碼是否正確
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('PASSWORD')
    }
    // 如果一切正常，調用 done(null, user, null) 將使用者物件傳遞給下一個處理程序
    return done(null, user, null)
  } catch (error) {
    console.log(error)
    if (error.message === 'ACCOUNT') {
      return done(null, null, { message: '使用者帳號不存在' })
    } else if (error.message === 'PASSWORD') {
      return done(null, null, { message: '使用者密碼錯誤' })
    } else {
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))

// 手動檢查Token有沒有過期
// 設置了一個使用 JWT 來驗證使用者身份的策略。當客戶端發送帶有 JWT 的請求時，Passport.js 將使用這個策略來驗證 JWT 的有效性和正確性
passport.use('jwt', new passportJWT.Strategy({
  // fromAuthHeaderAsBearerToken()，表示 JWT 將從 HTTP 請求的 Bearer token 中提取
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // 用於驗證 JWT 的密鑰，從環境變數中讀取
  passReqToCallback: true, // 是否將請求對象 (req) 傳遞給策略的驗證回調函數
  ignoreExpiration: true // 忽略 JWT 的過期檢查，表示即使 JWT 過期了，也不會引發錯誤
// 手動判斷過期
}, async (req, payload, done) => {
  try {
    // exp過期時間 ， 檢查 JWT 是否過期
    const expired = payload.exp * 1000 < new Date().getTime()

    /*
      http://localhost:4000/user/test?aaa=111&bbb=222
      req.originUrl = /user/test?aaa=111&bbb=222
      req.baseUrl = /user
      req.path = /test
      req.query = { aaa: 111, bbb: 222 }
    */

    // 判斷請求的網址
    const url = req.baseUrl + req.path
    // 如果 JWT 已過期且不是 `/user/extend` 或 `/user/logout` 的路徑
    if (expired && url !== '/user/extend' && url !== '/user/logout') {
      throw new Error('EXPIRED')
    }
    // 從請求中提取 JWT token
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    // 在資料庫中查找使用者，確保 JWT 和使用者的關聯性
    const user = await User.findOne({ _id: payload._id, tokens: token })
    if (!user) {
      throw new Error('JWT')
    }
    // 將使用者和 token 作為成功的結果傳遞給下一個處理程序
    return done(null, { user, token }, null)
  } catch (error) {
    console.log(error)
    if (error.message === 'EXPIRED') {
      return done(null, null, { message: '登入過期' })
    } else if (error.message === 'JWT') {
      return done(null, null, { message: '登入無效' })
    } else {
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))
