const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// var authenticate = require('../authenticate');
const Blogs = require('../models/blog');
const user = require('../models/user');

const blogRouter = express.Router();

blogRouter.use(express.json());

blogRouter.route('/')
.get( (req,res,next) => {
    Blogs.find({})
    // .populate('comments.author')
    .then((blogs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogs);
    }, (err) => next(err))
    .catch((err) => next(err));
})

blogRouter.route('/')
.post( (req,res,next) => {
    Blogs.create(req.body)
    .then((blog) => {
        console.log('Blog Created ', blog);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    }, (err) => next(err))
    .catch((err) => next(err));
})


blogRouter.route('/:blogId')
.get((req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('comments.author')
    .then((blog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Blogs.findByIdAndUpdate(req.params.blogId, {
//         $set: req.body
//     }, { new: true })
//     .then((blog) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(blog);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })

.delete( (req, res, next) => {
    Blogs.findByIdAndRemove(req.params.blogId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


blogRouter.route('/:blogId/comments')
.get((req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('comments.author')
    .then((blog) => {
        if (blog != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(blog.comments);
        }
        else {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            req.body.author = req.user._id;
            blog.comments.push(req.body);
            blog.save()
            .then((blog) => {
                bloges.findById(blog._id)
                .populate('comments.author')
                .then((blog) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete( (req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            for (var i = (blog.comments.length -1); i >= 0; i--) {
                blog.comments.id(blog.comments[i]._id).remove();
            }
            blog.save()
            .then((blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);                
            }, (err) => next(err));
        }
        else {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});



blogRouter.route('/:blogId/comments/:commentId')
.get((req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('comments.author')    
    .then((blog) => {
        if (blog != null && blog.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(blog.comments.id(req.params.commentId));
        }
        else if (blog == null) {
            err = new Error('Dish ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put( (req, res, next) => {
   
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        var Id1 = blog.comments.id(req.params.commentId).author;
        var id2 = req.user._id;
        if(Id1.equals(id2)) {
        if (blog != null && blog.comments.id(req.params.commentId) != null) {
          
            if (req.body.comment) {
                blog.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            blog.save()
            .then((blog) => {
                Blogs.findById(blog._id)
                .populate('comments.author')
                .then((blog) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);  
                })              
            }, (err) => next(err));
        }
        else if (blog == null) {
            err = new Error('Dish ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    } else {
        err = new Error('not at all authorized');
        err.status = 404;
        return next(err); 
    }
        }, (err) => next(err))
    .catch((err) => next(err));
}

)


.delete(
     (req, res, next) => {
    
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        var Id1 = blog.comments.id(req.params.commentId).author;
        var id2 = req.user._id;
        if(Id1.equals(id2))  {
        if (blog != null && blog.comments.id(req.params.commentId) != null) {

            blog.comments.id(req.params.commentId).remove();
            blog.save()
            .then((blog) => {
                Blogs.findById(blog._id)
                .populate('comments.author')
                .then((blog) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);  
                })               
            }, (err) => next(err));
        }
        else if (blog == null) {
            err = new Error('Dish ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    } else {
        err = new Error('not at all authorized');
        err.status = 404;
        return next(err); 
    }
        }, (err) => next(err))
    .catch((err) => next(err));
}

);



module.exports = blogRouter;