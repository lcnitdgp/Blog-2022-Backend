const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary')
const mongoose = require('mongoose');
const Blogs = require('../models/blog');
const User = require('../models/user');
var authenticate = require('../authenticate');
const blogRouter = express.Router();

blogRouter.use(express.json());
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

blogRouter.route('/getallblogs')
    .get((req, res, next) => {
        Blogs.find({})
           // .populate('comments.author')
            .then((blogs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blogs);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    blogRouter.route('/like')
    .post((req, res, next) => {
        Blogs.findById(req.body.id)
           // .populate('comments.author')
            .then((blog) => {
                if(blog)
                {
                    if(!blog.likedBy.includes(req.body.user_id)){
                        blog.likes = blog.likes+1;
                        blog.likedBy.push(req.body.user_id);
                    blog.save().then((blog)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(blog);
                    })
                    }
                    else{
                        blog.likes = blog.likes-1;
                        var index = blog.likedBy.indexOf(req.body.user_id);
                        if (index > -1) {
                            blog.likedBy.splice(index, 1);
                        }
                        blog.save().then((blog)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(blog);
                        })
                    }
                    
                   
            }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    blogRouter.route('/unpublished')
    .get((req, res, next) => {
        Blogs.find({ ispublished: false})
            //.populate('comments.author')
            .then((blogs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blogs);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

blogRouter.route('/')
    .post(authenticate.verifyUser, (req, res, next) =>{
        Blogs.create(req.body)
            .then( async (blog)=>{
                try{
                    const fileStr = req.body.image;
                   
                    const uploadResponse = await cloudinary.uploader.upload(fileStr,
                        result => {
                            if (result) {
                                blog.image = result.url;
                                blog.save()
                                    .then((blog) => {
                                        res.statusCode = 200;
                                        res.json(blog);
                                    },
                                        (err) => next(err))
                                    .catch((err) => console.log(err));
                            }
                        })

                    }                    

                catch (err) {
                    console.log(err);
                }
                console.log('Blog Created ', blog);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


blogRouter.route('/:blogId')
    .get((req, res, next) => {
        Blogs.findById(req.params.blogId)
           // .populate('comments.author')
            .then((blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Blogs.findByIdAndRemove(req.params.blogId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


blogRouter.route('/:blogId/comments')
    .get((req, res, next) => {
        Blogs.findById(req.params.blogId)
            //.populate('comments.author')
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
                console.log(blog)
                if (blog != null) {
                    // blog.comments.author = req.body.user_id;
                    User.findById(req.body.user_id).then((user)=>
                     { 
                        console.log(user.name);
                         blog.comments.push({author: user.name , comment: req.body.comment});
                     blog.save()
                        .then((blog) => {
                            console.log(blog)
                            Blogs.findById(req.params.blogId)
                                .then((blog) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(blog);
                                })
                        }, (err) => next(err));
                    })
                  
                }
                else {
                    err = new Error('blog ' + req.params.blogId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Blogs.findById(req.params.blogId)
            .then((blog) => {
                if (blog != null) {
                    for (var i = (blog.comments.length - 1); i >= 0; i--) {
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
    .get((req, res, next) => {
        Blogs.findById(req.params.blogId)
            //.populate('comments.author')
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

    .put(authenticate.verifyUser, (req, res, next) => {

        Blogs.findById(req.params.blogId)
            .then((blog) => {
                var Id1 = blog.comments.id(req.params.commentId).author;
                var id2 = req.user._id;
                if (Id1.equals(id2)) {
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


    .delete(authenticate.verifyUser,
        (req, res, next) => {

            Blogs.findById(req.params.blogId)
                .then((blog) => {
                    var Id1 = blog.comments.id(req.params.commentId).author;
                    var id2 = req.user._id;
                    if (Id1.equals(id2)) {
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


blogRouter.route('/admin')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Blogs.find({ ispublished: false })
            // .populate('comments.author')
            .then((blogs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blogs);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


blogRouter.route('/admin/:blogId')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Blogs.findById(req.params.blogId)
           // .populate('comments.author')
            .then((blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Blogs.findById(req.params.id)
            .then((blog) => {
                blog.ispublished = true;
                blog.save()
            })
            .then((blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
            }, (err) => next(err))
            .catch((err) => next(err));
    })



module.exports = blogRouter;