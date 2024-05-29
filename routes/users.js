const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

router.post('/', async(req, res, next) => {
    const {email, name, password, confirmPassword} = req.body
    if (!email || !password) {
        req.flash('error', '請輸入 Eamil 及 Password')
        return res.redirect('back')
    }

    if(password !== confirmPassword) {
        req.flash('error', '密碼與驗證密碼不符')
        return res.redirect('back')
    }

    try {
        const rowCount = await User.count({where: { email }})
        if (rowCount > 0) {
            req.flash('error', 'email 已註冊')
            return res.redirect('back')
        }
        const user = await User.create({email, name, password})
        req.flash('success', '註冊成功')
        return res.redirect('/login')
    } catch (error) {
        error.errorMessage = '註冊失敗'
        next(error)
    }
})

module.exports = router