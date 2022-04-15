const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const tokenService = require('../service/token.service')

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

            const tokens = tokenService.generate({ _id: newUser._id })
            await tokenService.save(newUser._id, tokens.refreshToken)

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

router.post('/signInWithPassword', [
    check('email', 'Email некорректный').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(),
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400
                    }
                })
            }

            const { email, password}  = req.body

            const existingUser = await User.findOne({ email })

            if (!existingUser) {
                return res.status(400).send({
                    error: {
                        message: 'EMAIL_NOT_FOUND',
                        code: 400
                    }
                })
            }

            console.log(password)
            console.log(existingUser.password)
            const isPasswordEqual = await bcrypt.compare(password, existingUser.password)

            console.log(isPasswordEqual)
            if (!isPasswordEqual) {
                return res.status(400).send({
                    error: {
                        message: 'INVALID_PASSWORD',
                        code: 400
                    }
                })
            }

            const tokens = tokenService.generate({ _id: existingUser._id })
            await tokenService.save(existingUser._id, tokens.refreshToken)

            res.status(200).send({
                ...tokens,
                userId: existingUser._id
            })

        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    }]
)

router.post('/token', async (req, res) => {
    }
)

module.exports = router
