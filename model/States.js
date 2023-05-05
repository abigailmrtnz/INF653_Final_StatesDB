const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//mongoDB schema - statCode property with string, required, and Unique
const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: [{
        type: String,
    }]
});

module.exports = mongoose.model("State", stateSchema);