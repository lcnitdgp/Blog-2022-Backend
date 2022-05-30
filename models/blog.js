const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
}, {
    timestamps: true
});

var blogSchema = new Schema({
    author:{
          type : String,
          required : true
    },
    date:{
        type : String,
        required : false
    },
    title:{
        type : String,
        required : true
    },
    image:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    type_of_post: {
        type: String,
        required: true
    },
    comments: [commentSchema]

},{
    timestamps: true
});