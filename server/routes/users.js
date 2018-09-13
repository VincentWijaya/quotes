const express = require('express');
const router = express.Router();
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const encrypt = require('../helpers/encrypt')

router.get('/', function(req, res, next) {
  res.send('INDEX USER');
});

router.post('/register', (req, res) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  
  User.create(newUser)
    .then(() => {
      res.status(201).json({success: true, message: `Account ${newUser.name} registered`})
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
})

router.post('/login', (req, res) => {
  let hashed = encrypt.hashPassword(req.body.password, req.body.email)
  
  User.findOne({email: req.body.email, password: hashed})
    .then(user => {
      let dataToken = {
        id: user._id
      }
      
      jwt.sign(dataToken, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(201).json({token: token})
        }
      })
    })
    .catch(err => {
      res.status(500).json({error: err.message})
    })
})

module.exports = router;