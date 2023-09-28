const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    // syntax to add multiple sort params - devided by space
    // const products = await Product.find({}).sort('-name price') 
    const products = await Product.find({})
    .select('name price')
    .limit(4)
    .skip(3)
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields} = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        queryObject.name = {$regex: name, $options: 'i'}  // query operators; comes from MongoBD
    }

    // console.log(queryObject)

    let result = Product.find(queryObject)
    // sort  -- Mongoose query
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    // select
    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)    
    }
    // pagination
    // example: 23 items total; if limit set to 7 per page -> 4 pages: 7 7 7 2 items on each page
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}