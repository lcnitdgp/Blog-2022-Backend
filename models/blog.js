const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
  
    comment:  {
        type: String,
        required: true
    },
    author: {
        type: String,
        
    }
}, {
    timestamps: true
});

var blogSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    type_of_post: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
   
    likedBy: [],
    
    ispublished: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Blogs = mongoose.model('Blog', blogSchema);

module.exports = Blogs;