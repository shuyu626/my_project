import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

// 登入的middleware
// 使用驗證，session: false 解決cookie的問題
export const login = (req, res, next) => {
  // passport.authenticate 使用 login 策略
  //  先執行login，不管是否通過都會回來執行 (error, user, info) => {}
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (!user || error) { // 驗證失敗或發生了錯誤
      if (info.message === 'Missing credentials') { // 請求缺少必要的欄位
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '輸入欄位錯誤'
        })
        return
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: info.message
        })
        return
      }
    }
    // 如果驗證成功，將使用者物件存儲在req.user中並繼續處理
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  // 使用 Passport.js 的 authenticate 方法來執行 JWT 策略的驗證
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '登入無效'
        })
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
      }
      return
    }
    // 如果驗證成功，將 data.user 賦值給 req.user，表示已驗證的使用者資料
    // 將 data.token 賦值給 req.token，這樣後續的路由或控制器可以使用這個 token 進行進一步的操作。
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
