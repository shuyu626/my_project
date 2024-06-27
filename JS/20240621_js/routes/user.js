import { Router } from 'express'
import { create, addCart, getId } from '../controllers/user.js'

// 建立 express 的 路由
const router = new Router()

// 執行create function，把處理東西的 function 拆出來寫
router.post('/', create)
// http://localhost/4000/users/
router.post('/:uid/cart', addCart)
router.get('/:uid', getId)

export default router
