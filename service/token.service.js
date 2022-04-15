const jwt = require('jsonwebtoken')
const config = require('config')
const Token = require('../models/Token')
class TokenService {
    generate(paylod) {
        const accessToken = jwt.sign(paylod, config.get('accessSecret'), {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign(paylod, config.get('refreshSecret'))
        return {
            accessToken,
            refreshToken,
            expiresIn: 3600
        }
    }

    async save(userId, refreshToken) {
        const data = await Token.findOne({ user: userId })
        if (data) {
            data.refreshToken = refreshToken
            return data.save()
        }

        const token = await Token.create({
            user: userId,
            refreshToken
        })

        return token
    }
}

module.exports = new TokenService()
