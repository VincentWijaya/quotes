const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote')
const {auth} = require('../middleware/auth')
const {isHim} = require('../middleware/isHim')

const encrypt = require('../helpers/encrypt')

router.get('/', (req, res) => {
  Quote.find()
    .populate('user', '_id email')
    .then(quotes => {
      res.status(200).json(quotes)
    })
    .catch(err => {
      res.status(500).json({error: err.message})
    })
})

router.post('/', auth, (req, res) => {
  let newQuote = {
    status: req.body.status,
    user: req.decoded.id
  }
  
  Quote.create(newQuote)
    .then(quote => {
      res.status(201).json(quote)
    })
    .catch(err => {
      res.status(500).json({error: err.message})
    })
})

router.delete('/:id', auth, isHim, (req, res) => {
  Quote.deleteOne({_id: req.params.id})
  .then(() => {
    res.status(201).json({success: true, message: `Quote with id ${req.params.id} deleted`})
  })
  .catch(err => {
    res.status(500).json({error: err.message})
  })
})

module.exports = router