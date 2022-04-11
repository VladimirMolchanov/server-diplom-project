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
        ref: 'Color'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    img: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = model('Products', schema)
