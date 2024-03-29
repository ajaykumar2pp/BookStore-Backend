const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        books:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            }
        ],
        date:{ type:String, default:Date.now },
        isAdmin:{
            type:Boolean,
            default:false
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
       
    },
    { timestamps: true });
module.exports = mongoose.model('Author', userSchema);