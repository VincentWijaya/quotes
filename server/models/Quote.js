const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    status: {
        type: String,
        require: true
    },
    user : { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
}, {timestamps:true})


const Quote = mongoose.model('Quote', quoteSchema)

module.exports = Quote