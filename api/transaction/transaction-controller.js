const transactionService = require('./transaction-service')
const logger = require('../../services/logger.service')

async function setTransaction(req, res) {
    console.log(req.body);
    try {
        const transactions = await transactionService.setTransaction(req.body)
        res.send(transactions)
    } catch (err) {
        logger.error('Failed to create product', err)
        res.status(500).send({ err: 'Failed to create product' })
    }
}

module.exports = {
    setTransaction,
}