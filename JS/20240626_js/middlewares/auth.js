// 處理驗證相關，呼叫login
import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 呼叫驗證方式進行驗證
  // { session: false } 停用 cookiee(因可能會被擋)
  //  使用了 Passport 的 authenticate 方法來進行使用者的身份驗證，並且指定了使用名為 'login' 的策略
  // (error, user, info) 對應到驗證方式 done(錯誤, 要傳果來的資料 不一定叫user, 執行的一些訊息 錯誤訊息之類的) 的參數
  passport.authenticate('login', { session: false }, (error, user, info) => {
    console.log(error, user, info)
    // 處理錯誤
    // 身份驗證失敗或出現錯誤的話
    if (!user || error) {
      // Missing credentials 是 LocalStrategy 的訊息
      // 代表進來的資料缺少指定欄位
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '資料欄位錯誤'
        })
        return // 一定要return ，不然會執行next()進到下一步
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return // 一定要return ，不然會執行next()進到下一步
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ // 401
          success: false,
          message: info.message
        })
        return // 一定要return ，不然會執行next()進到下一步
      }
    }
    // 將查詢到的使用者資料放入 req 中給後面的東西使用
    req.user = user
    // 繼續下一步
    next()
  })(req, res, next)
}

// 使用 Passport 的 authenticate 方法來進行 JWT 認證，並根據不同的錯誤情況返回相應的回應
export const jwt = (req, res, next) => {
  // 使用 Passport 的 authenticate 方法來進行 JWT 認證，使用 'jwt' 策略
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    console.log(error, data, info)
    // 如果有錯誤或者認證資料不存在，則返回適當的錯誤回應
    if (error || !data) {
      // 是不是 JWT 策略的錯誤
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        // JWT 過期
        if (info.name === 'TokenExpiredError') {
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'JWT 過期'
          })
        } else {
          // 可能是 JWT 被竄改導致用 SECRET 驗證失敗
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'JWT 驗證失敗'
          })
        }
      } else if (info.message === 'No auth token') {
        // 過期
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '沒有 JWT'
        })
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
      }
      return
    }
    // 如果認證成功，將使用者資料和 token 存放在 req 物件中，以便後續middleware或路由處理使用
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
