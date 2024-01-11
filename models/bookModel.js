import mongoose from 'mongoose';


const bookSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publishYear: {
        type: Number,
        required: true,
    },
    userId:{
        type:String,
        required: true
    },
    image:{
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
    bookId: {
        type: String,
        required: true,

    },

    transactionId:{
        type: String,
        default: ""
    }


},
    {
        timestamps: true
    }

);

export const Book = mongoose.model('Book',bookSchema)