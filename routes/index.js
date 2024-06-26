const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const todos = require('./todos')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {email: username},
        raw: true
    })
    .then((user) => {
        if (!user || user.password !== password) {
            return done(null, false, {message: 'email 或密碼錯誤'})
        }
        return done(null, user)
    })
    .catch((error) => {
        error.errorMessage = '登入失敗'
        done(error)
    })
}))
passport.serializeUser((user, done) => {
    const {id, name, email} = user
    console.log('serialize: ', user)
    return done(null, {id, name, email})
})
passport.deserializeUser((user, done) => {
    console.log('deserialize: ', user)
    done(null, { id: user.id })
})

router.use('/todos', authHandler, todos)
router.use('/users', users)

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/todos',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/logout', (req, res, next) => {
    console.log('Logging our user: ', req.user)
    req.logout((error) => {
        if (error) {
            next(error)
        } 
        console.log('User logged out')
        return res.redirect('/login')
    })
})

module.exports = router