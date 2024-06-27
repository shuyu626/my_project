import { Router } from 'express'
import { create, login, profile, logout, avatar } from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', create)
// 把middleware加進去，會依照順序一個一個執行，順序會影響
router.post('/login', auth.login, login)
// 第三個 login 是 controllers的 可用req.user去取得使用者資料

router.get('/profile', auth.jwt, profile)

router.delete('/logout', auth.jwt, logout)
router.patch('/avatar', auth.jwt, upload, avatar)
export default router
