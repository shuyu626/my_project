import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'
// import jwt from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

export const create = async (req, res) => {
  try {
    const result = await User.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.error(error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '使用者名重複'
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
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 簽署一個jwt給使用者
export const login = async (req, res) => {
  try {
    // jwt.sign(保存資料, SECRET, 設定)
    const token = jwt.sign(
      { _id: req.user._id.toString() }, // 將使用者的 _id 轉換為字串並作為 JWT 的 payload
      process.env.JWT_SECRET, // 使用環境變數中的 JWT_SECRET 作為簽名密鑰
      // { expiresIn: '7 days' }
      { expiresIn: '7d' } // 設置 JWT 的過期時間為 7 天
    )
    // 只認序號不認人
    // 有人覺得jwt偏一次性，只認token就給資料
    // 有人覺得jwt簽出去就不能撤銷(失效前)，這期間登出了又拿token來拿資料怪怪的，所以認為要存到資料庫裡(比較好管理哪幾組token是有效的)，老師傾向存到資料庫
    req.user.tokens.push(token) // 將生成的 JWT 加入使用者的 tokens
    await req.user.save() // 因auth.js 有 req.user = user
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    // 可能有很多種錯誤，直接給未知錯誤
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const profile = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      name: req.user.name,
      avatar: req.user.avatar
    }
  })
}

// 負責處理使用者登出的功能
export const logout = async (req, res) => {
  try {
    // 在使用者的 tokens 陣列中尋找目前使用的 token 的索引
    const idx = req.user.tokens.findIndex(token => token === req.token)
    // 從使用者的 tokens 陣列中移除該 token
    req.user.tokens.splice(idx, 1)
    // 將使用者資料保存到資料庫中
    await req.user.save()

    // 成功處理登出，回傳成功訊息
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    // 返回內部伺服器錯誤訊息給用戶端
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const avatar = async (req, res) => {
  try {
    console.log(req.file)
    req.user.avatar = req.file.path
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.avatar
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
