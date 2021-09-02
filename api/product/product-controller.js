const productService = require('./product-service')
const logger = require('../../services/logger.service')
async function getProducts(req, res) {
    try {
        const filterBy = {
            title: req.query.title || '',
        }
        const products = await productService.query(filterBy)
        res.send(products)
    } catch (err) {
        logger.error('Faild to get products', err)
        res.status(500).send({ err: 'Faild to get products' })
    }
}

async function getstats(req, res) {
    try {
        const products = await productService.getStats()
        res.send(products)
    } catch (err) {
        logger.error('Faild to get products', err)
        res.status(500).send({ err: 'Faild to get products' })
    }
}

async function getProduct(req, res) {
    try {
        const { productId } = req.params
        const product = await productService.getById(productId)
        res.send(product)
    } catch (err) {
        logger.error('Failed to get product', err)
        res.status(500).send({ err: 'Failed to get product' })
    }
}

async function deleteProduct(req, res) {
    try {
        const { productId } = req.params
        await productService.remove(productId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete product', err)
        res.status(500).send({ err: 'Failed to delete product' })
    }
}

async function createProduct(req, res) {
    try {
        const { title, price, description, imgUrl } = req.body
        const product = {
            title,
            description,
            price,
            createdAt: Date.now(),
            imgUrl: imgUrl || 'https://dilavr.com.ua/image/catalog/empty-img.png'
        }
        const newProduct = await productService.add(product)
        res.send(newProduct)
    } catch (err) {
        logger.error('Failed to create product', err)
        res.status(500).send({ err: 'Failed to create product' })
    }
}

async function updateProduct(req, res) {
    try {
        const { _id, title, price, purchases, createdAt, description, imgUrl } = req.body
        const product = {
            _id,
            title,
            description,
            price,
            createdAt,
            purchases,
            imgUrl
        }
        const savedProduct = await productService.update(product)
        res.send(savedProduct)
    } catch (err) {
        logger.error('Failed to update product', err)
        res.status(500).send({ err: 'Failed to update product' })
    }
}

// async function transaction(req, res) {
//     try {
//         const transactions = await productService.transaction(req.body)
//         res.send(transactions)
//     } catch (err) {
//         logger.error('Failed to create product', err)
//         res.status(500).send({ err: 'Failed to create product' })
//     }
// }

module.exports = {
    getProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    createProduct,
    // transaction,
    getstats
}