const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String
    },
    color: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = model('Color', schema)
