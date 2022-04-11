const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String
    },
    id: {
        type: String
    }

}, {
    timestamps: true
})

module.exports = model('Category', schema)
