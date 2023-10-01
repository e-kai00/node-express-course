const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    // syntax to add multiple sort params - devided by space
    const products = await Product.find({price: {$gt: 50}})
    .sort('price')
    .select('name price')
    .limit(4)
    .skip(3)
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
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

    if (numericFilters) {
        // user-friendly oprators
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }

        // converts to Mongoose operators 
        const regEx =  /\b(>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) =>  {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })

        console.log(filters)
    }

    console.log(queryObject)

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