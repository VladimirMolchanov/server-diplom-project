const express = require('express')
const router = express.Router({
    mergeParams: true
})

router.use('/auth', require('./auth.routes'))
router.use('/category', require('./category.routes'))
router.use('/color', require('./color.routes'))
router.use('/products', require('./products.routes'))

module.exports = router
