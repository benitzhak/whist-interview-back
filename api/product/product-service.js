const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    // transaction,
    getStats
}

async function query(filterBy) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('product')
        var products = await collection.find(criteria).toArray()
        products = products.map(product => {
            return product
        })
        return products
    } catch (err) {
        logger.error('cannot find products', err)
        throw err
    }
}
async function getStats() {
    try {
        const collection = await dbService.getCollection('statistic')
        var products = await collection.find().toArray()
        products = products.map(product => {
            return product
        })
        return products
    } catch (err) {
        logger.error('cannot find products', err)
        throw err
    }
}

async function getById(productId) {
    try {
        const collection = await dbService.getCollection('product')
        const product = await collection.findOne({ '_id': ObjectId(productId) })
        return product
    } catch (err) {
        logger.error(`while finding product ${productId}`, err)
        throw err
    }
}

async function remove(productId) {
    try {
        const collection = await dbService.getCollection('product')
        await collection.deleteOne({ '_id': ObjectId(productId) })
    } catch (err) {
        logger.error(`cannot remove product ${productId}`, err)
        throw err
    }
}

async function update(product) {
    try {
        const productToSave = {
            _id: ObjectId(product._id),
            title: product.title,
            description: product.description,
            price: +product.price,
            createdAt: product.createdAt,
            purchases: product.purchases,
            imgUrl: product.imgUrl
        }
        const collection = await dbService.getCollection('product')
        await collection.updateOne({ '_id': productToSave._id }, { $set: productToSave })
        return productToSave;
    } catch (err) {
        logger.error(`cannot update product ${product.title}`, err)
        throw err
    }
}

async function add(product) {
    try {
        const productToAdd = {
            title: product.title,
            description: product.description,
            price: +product.price,
            createdAt: product.createdAt,
            imgUrl: product.imgUrl
        }
        const collection = await dbService.getCollection('product')
        await collection.insertOne(productToAdd)
        return productToAdd
    } catch (err) {
        logger.error('cannot insert product', err)
        throw err
    }
}

// async function transaction(products) {
//     try {
//         let transaction = {
//             transactionAt: Date.now(),
//             products
//         }
//         await statistic(transaction)
//         const collection = await dbService.getCollection('transaction')
//         await collection.insertOne(transaction)
//         return transaction
//     } catch (err) {
//         console.log('cannot insert products', err);
//         throw err
//     }
// }

async function statistic(transaction) {
    try {
        const collection = await dbService.getCollection('statistic')
        let statistic = transaction.products.map(async p => {
            let product = await collection.findOne({ '_id': ObjectId(p._id) })
            if (product) {
                product.unique++
                    await collection.updateOne({ '_id': product._id }, { $set: product })
                await collection.updateOne({ '_id': product._id }, { $inc: { quantity: 1 } })
            } else {
                product = {
                    _id: ObjectId(p._id),
                    title: p.title,
                    quantity: 1,
                    unique: 1
                }
                await collection.insertOne(product)
            }
        })
        return statistic
    } catch (err) {
        console.log('cannot insert statistic', err);
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        const nameCriteria = { $regex: filterBy.title, $options: 'i' }
        criteria.$or = [{
            name: nameCriteria
        }]
    }
    return criteria
}