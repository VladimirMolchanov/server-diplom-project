const express = require('express')
const Products = require('../models/Products')
const auth = require('../middleware/auth.middleware')
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

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
    .put('/',auth, async (req, res) => {
        try {
            const newProduct = await Products.create({
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
    .post('/img', auth, async (req, res) => {
        try {
            let imageFile = req.files.file;
            if (imageFile.mimetype !== 'image/png') {
                return res.status(400).send({
                    error: {
                        message: 'Можно загружать только картинки формата png',
                        code: 400
                    }
                })
            }

            const exp = imageFile.mimetype.split("/")[1]
            const dirPath = path.join(__dirname, '..');
            const name = Date.now()
            await imageFile.mv(`${dirPath}/assets/image/${name}.${exp}`, function(err) {
                if (err) {
                    return res.status(500).send(err);
                }
            });
            res.status(200).send({file: `assets/image/${name}.${exp}`})
        } catch (e) {
            console.log(e)
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
    .patch('/:productId', auth, async (req, res) => {
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
