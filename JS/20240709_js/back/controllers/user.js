import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

export const create = async (req, res) => {
  try {
    await User.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號已註冊'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    // 使用 JWT 簽署 token，包含使用者的 _id
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 將生成的 token 加入使用者的 tokens 屬性中
    req.user.tokens.push(token)
    // 將使用者物件保存到資料庫中，包括更新後的 tokens 屬性
    await req.user.save()
    // 返回成功的 HTTP 狀態碼和包含使用者資訊的 JSON 回應
    res.status(StatusCodes.OK).json({
      // 把前端會用到的資訊給回傳
      // 前端要顯示甚麼救回傳什麼
      success: true,
      message: '',
      result: {
        token, // 返回生成的 token
        account: req.user.account, // 返回使用者的帳號
        role: req.user.role, // 返回使用者的角色
        cart: req.user.cartQuantity // 返回使用者的購物車數量（假設有這個屬性）
      }
    })
    // 如果發生任何錯誤，返回內部伺服器錯誤的 HTTP 狀態碼和錯誤訊息
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 舊換新
// 定義了一個用於更新和延長 JWT token 的路由處理函式 extend
export const extend = async (req, res) => {
  try {
    // 找到當前使用的 token 在 tokens 陣列中的索引
    const idx = req.user.tokens.findIndex(token => token === req.token)
    // 簽新的，簽發一個新的 JWT token，並設置有效期為 7 天
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 更新使用者 tokens 陣列中的對應索引位置的 token
    req.user.tokens[idx] = token
    // 將更新後的使用者資訊保存到資料庫
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 使用者登入，
export const profile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        role: req.user.role,
        cart: req.user.cartQuantity
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 當 POST 請求發送到 /user/logout 路由時，將會先進行 JWT 驗證，並在驗證成功後調用 logout 函式來清除當前的 JWT token
export const logout = async (req, res) => {
  try {
    //  過濾掉當前使用的 JWT token
    // req.token 可以獲取到當前的 JWT token
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    // 將更新後的使用者資訊保存到資料庫
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
