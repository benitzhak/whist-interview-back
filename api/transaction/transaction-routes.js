const express = require('express')
const { setTransaction } = require('./transaction-controller')
const router = express.Router()



router.post('/transaction', setTransaction)

module.exports = router