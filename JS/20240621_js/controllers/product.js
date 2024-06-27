import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    const result = await Product.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
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

export const getAll = async (req, res) => {
  try {
    // query 用在過濾的條件
    console.log(req.query)

    // const result = await Product.find({
    //   // price >= 500 && category === '音樂'
    //   category: '音樂', // 類別是音樂
    //   price: { $gte: 500 } // 且價錢 >= 500
    // })

    // 名稱是否有 Phone i為不分大小寫
    // const result = await Product.find({
    //   name: /Phone/i
    // })

    // .sort({ 欄位: 值 })
    // 1 = 正序
    // -1 = 倒序
    // .limit(限制回傳資料數量)，限制幾個就會只跳出幾個
    // .skip(跳過筆數)，跳過前幾筆
    // 出來的結果價格由大到小去排序
    // 要做分頁的話要用.limit()、.skip()去做(一頁想顯示幾筆)
    // const result = await Product.find().sort({ price: -1 }).limit(2).skip(2)

    // 變數的值當物件的key要加[]
    // 動態修改查詢結果
    // 使用了 Mongoose 提供的 find() 方法來查詢資料庫中的產品（Product）文件，同時應用了排序功能
    const result = await Product.find().sort({ [req.query.sortBy || '_id']: req.query.sort * 1 || 1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
