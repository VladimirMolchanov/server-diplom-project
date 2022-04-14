const express = require('express')
const User = require('../models/User')
const TokenService = require('../service/token.service')

const router = express.Router({
    mergeParams: true
})

router.post('/signUp', async (req, res) => {
    try {
        const { email, password } = req.body

        const exitingUser = await User.findOne({ email })

        if (exitingUser) {
            return res.status(400).json({
                error: {
                    message: 'EMAIL_EXISTS'
                }
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = User.create({
            password: hashedPassword,
            email,
            ...req.body
        })

        const tokens = TokenService.generate({ _id: newUser._id })

        res.status(201).send({
            ...tokens, userId: newUser._id
        })
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

router.post('/signInWithPassword', async (req, res) => {

})

router.post('/token', async (req, res) => {

})

module.exports = router
