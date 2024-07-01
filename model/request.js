const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    request_number: {
        type: String,
        required: true,
        unique: true,
    }
},{timestamps:true});

module.exports = new mongoose.model('request', requestSchema);
