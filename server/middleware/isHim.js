let Quote = require('../models/Quote')

module.exports = {
  isHim: function(req, res, next) {
    Quote.findOne({_id: req.params.id, user: req.decoded.id})
      .then(data => {
        if (data) {
          next()
        } else {
          res.status(401).json({error: 'You are not allowed to delete this quote!'})
        }
      })
      .catch(err => {
        res.status(500).json({error: err.message})
      })
  }
}