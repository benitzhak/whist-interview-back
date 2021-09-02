const dbService = require('../../services/db.service')
const productService = require ('../product/product-service.js')

module.exports = {
    setTransaction,
}

async function setTransaction(products) {
    console.log(products);
    try {
        let transaction = {
            transactionAt: Date.now(),
            products
        }
        await productService.statistic(transaction)
        const collection = await dbService.getCollection('transaction')
        await collection.insertOne(transaction)
        return transaction
    } catch (err) {
        console.log('cannot insert products', err);
        throw err
    }
}

