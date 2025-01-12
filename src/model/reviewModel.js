const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema  = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5,default:0 },
        comment: { type: String, required: true },
        date:{ type:String},
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
       
    },
    { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);