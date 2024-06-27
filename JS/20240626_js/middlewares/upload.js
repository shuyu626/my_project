import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  // 收到檔案後放哪裡
  storage: new CloudinaryStorage({ cloudinary }),
  // 檔案篩選器，決定哪些檔案可以被接受
  // (HTTP 請求物件, 接收到的檔案物件, 回調函數 用於通知 multer 是否允許上傳)
  fileFilter (req, file, callback) {
    console.log(file)
    // 檢查檔案的 MIME 類型是否為 'image/jpeg' 或 'image/png'
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // callback(拋出的錯誤, 是否允許上傳)
      callback(null, true)
    } else {
      // 如果檔案類型不符合，調用 callback(new Error('FORMAT'), false) 表示拒絕上傳
      callback(new Error('FORMAT'), false)
    }
  },
  // 設定上傳檔案的大小限制
  limits: {
    // 上傳限制，限制檔案大小為 1MB
    fileSize: 1024 * 1024
  }
})

export default (req, res, next) => {
  // 接收 1 個 image 欄位的檔案
  // upload.single('image')  ---> req.file
  // 接收 10 個 image 欄位的檔案
  // upload.array('image', 10)  ---> req.files
  // 接收 1 個 avatar 欄位和 5 個 photo 欄位的檔案
  // upload.fields([
  //   { name: 'avatar', maxCount: 1 },
  //   { name: 'photo', maxCount: 5 }
  // ])
  // req.files.avatar[1]
  // req.files.photo[0]
  upload.single('avatar')(req, res, error => {
    console.log(error)
    if (error instanceof multer.MulterError) {
    // 上傳錯誤
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error) {
    // 其他錯誤
      if (error.message === 'FORMAT') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '檔案格式錯誤'
        })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
      }
    } else {
      next()
    }
  })
}
