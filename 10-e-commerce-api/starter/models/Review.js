const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please provide rating.'],
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Please provide title.'],
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, 'Please provide comment.'],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        },    
    },
    {timestamps: true}
);

// user can leave 1 review per product (set via compound index from mongoose)
ReviewSchema.index({user:1, product:1}, {unique: true});


module.exports = mongoose.model('Review', ReviewSchema);