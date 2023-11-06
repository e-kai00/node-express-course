const {StatusCodes} = require('http-status-codes')
const path = require('path')
const CustomError = require('../errors')


const uploadProductImage = async (req, res) => {
    // check if file exist
    if (!req.files) {
        throw new CustomError.BadRequestError('No File Uploaded');
    };     
    const productImage = req.files.image;
    // check format
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Uploaded Image');
    };
    // check size
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller image');
    };

    // construct path
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);

    return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}});
};


module.exports = {uploadProductImage}