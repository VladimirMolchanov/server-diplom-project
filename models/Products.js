const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String
    },
    second: {
        type: String
    },
    price: {
        type: Number
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    img: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = model('Products', schema)
