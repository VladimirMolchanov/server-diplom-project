const express = require('express')
const router = express.Router({
    mergeParams: true
})

router.get('/', async (req, res) => {
    try {
        const list = [];
        res.status(200).send(list)
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
        console.log(e)
    }
})

module.exports = router