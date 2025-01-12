require('dotenv').config()
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
    {
        bookTitle: { type: String, required: true },
        authorName: { type: String, required: true },
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Author'
        },
        // pages: { type: Number, required: true },
        // isbn: { type: String, required: true },
        content: { type: String, required: true },
        price: { type: Number, required: true, min:0 },
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        image: {
            type: String, required: true,
        }

    },
    { timestamps: true}
);
module.exports = mongoose.model('Book', bookSchema);