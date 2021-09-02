const express = require('express')
const { getstats, createProduct, getProduct, getProducts, deleteProduct, updateProduct } = require('./product-controller')
const router = express.Router()


router.get('/stats', getstats)
router.get('/', getProducts)
router.post('/', createProduct)
router.put('/', updateProduct)
router.get('/:productId', getProduct)
router.delete('/:productId', deleteProduct)


module.exports = router