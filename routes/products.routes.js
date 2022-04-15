const express = require('express')
const Products = require('../models/Products')
const auth = require('../middleware/auth.middleware')

const router = express.Router({
    mergeParams: true
})

router
    .get('/', async (req, res) => {
        try {
            const { orderBy, equalTo } = req.query
            const list = await Products.find({ [orderBy]: equalTo });
            res.status(200).send(list)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
            console.log(e)
        }
    })
    .post('/',auth, async (req, res) => {
        try {
            const newProduct = await Products.create({
                ...req.body,
            })
            res.status(201).send(newProduct)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })
    .get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        const product = await Products.findById(productId)
        res.status(200).json(product)
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})
    .patch('/:productId', async (req, res) => {
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
    .delete('/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params
        const removedProduct = await Products.findById(productId)

        await removedProduct.remove()
        return res.send(null)
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

module.exports = router
