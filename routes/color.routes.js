const express = require('express')
const Color = require('../models/Color')
const auth = require("../middleware/auth.middleware");
const Products = require("../models/Products");
const router = express.Router({
    mergeParams: true
})

router.get('/', async (req, res) => {
    try {
        const list = await Color.find()
        res.status(200).send(list)
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
        console.log(e)
    }
})
    .put('/',auth, async (req, res) => {
        try {
            const newProduct = await Color.create({
                ...req.body,
            })
            res.status(201).send(newProduct)
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })
    .patch('/:colorId', auth, async (req, res) => {
        try {
            const { colorId } = req.params
            if (colorId) {
                const updatedColor = await Color.findByIdAndUpdate(colorId, req.body, {
                    new: true
                })
                res.send(updatedColor)
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
    .delete('/:colorId', auth, async (req, res) => {
        try {
            const { colorId } = req.params
            const removedColor = await Color.findById(colorId)

            await removedColor.remove()
            return res.send(null)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })
module.exports = router
