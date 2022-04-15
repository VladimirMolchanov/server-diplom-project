const express = require('express')
const Products = require('../models/Products')
const router = express.Router({
    mergeParams: true
})

router.get('/', async (req, res) => {
    try {
        const list = await Products.find();
        res.status(200).send(list)
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
        console.log(e)
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params



    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

router.patch('/:productId', async (req, res) => {
    try {
        const { productId } = req.params

        if (productId) {
            const updatedProduct = await Products.findByIdAndUpdate(productId, req.body, {
                new: true
            })
            res.send(updatedProduct)
        } else {
            res.status(401).json({
                message: 'Unauthorized'
            })
        }

    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

module.exports = router
