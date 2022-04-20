const Products = require('../models/Products')
const Color = require('../models/Color')
const Category = require('../models/Category')
const ProductsMock = require('../mock/products.json')
const ColorMock = require('../mock/color.json')
const CategoryMock = require('../mock/category.json')

module.exports = async () => {
    // const color = await Color.find()
    // if (color.length !== ColorMock.length) {
    //     await generateSimpleEntity(Color, ColorMock)
    // }
    //
    // const category = await Category.find()
    // if (category.length !== CategoryMock.length) {
    //     await generateSimpleEntity(Category, CategoryMock)
    // }
    //
    // const products = await Products.find()
    // if (products.length !== ProductsMock.length) {
    //     await createInitialEntityProduct(Products, ProductsMock)
    // }
}

const generateSimpleEntity = (model, data) => {
    return Promise.all(
        data.map(async (example) => {
            try {
                const exm = await model.find({
                    name: example.name,
                });
                if (exm.length !== 0) {
                    return exm[0];
                }
                delete example._id;
                const newExm = new model(example);
                await newExm.save();
                return newExm;
            } catch (error) {
                return error;
            }
        })
    );
};

async function createInitialEntityProduct(Model, data) {
    await Model.collection.drop()
    const color = await Color.find()
    const category = await Category.find()
    return Promise.all(
        data.map(async item => {
            try {
                delete item._id
                const colorId = color.find(i => i.id === item.color)._id
                const categoryId = category.find(i => i.id === item.category)._id
                const newItem = new Model({
                    ...item,
                    color: colorId,
                    category: categoryId
                })
                await newItem.save()
                return newItem
            } catch (e) {
                return e
            }
        })
    )
}
