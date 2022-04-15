const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const TokenService = require('../service/token.service')

const router = express.Router({
    mergeParams: true
})

const signUpValidations = [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 8 символов').isLength({min: 8})
]

router.post('/signUp', [
    ...signUpValidations,
    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400,
                        error: error.array()
                    }
                })
            }

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
                email,
                ...req.body,
                password: hashedPassword
            })

            const tokens = TokenService.generate({ _id: newUser._id })
            await TokenService.save(newUser._id, tokens.refreshToken)

            res.status(201).send({
                ...tokens, userId: newUser._id
            })
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    }]
)

router.post('/signInWithPassword', async (req, res) => {
})

router.post('/token', async (req, res) => {

    }
)

module.exports = router
