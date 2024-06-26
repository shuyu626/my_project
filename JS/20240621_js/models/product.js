import { Schema, model } from 'mongoose'

const schema = new Schema({
  // 商品名稱
  name: {
    type: String,
    // '商品名稱必填' 是錯誤訊息
    required: [true, '商品名稱必填']
  },
  price: {
    type: Number,
    require: [true, '商品價格必填'],
    min: [0, '商品價格不正確']
  },
  // 商品的分類
  category: {
    type: String,
    enum: {
      // 限制欄位只能有陣列內的值
      values: ['遊戲', '音樂', '衣服', '手機'],
      // 錯誤訊息，{VALUE} 會自動替換成傳入的值
      message: '商品分類錯誤，查無 "{VALUE}" 分類'

    }
  }
})

export default model('product', schema)
