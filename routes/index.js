/**
 * flapper-news/routes/index.js
**/
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }
    
    res.json(posts);
  });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  
  post.save(function(err, post) {
    if (err) { return next(err); }
    
    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  console.log('param.post(id)::', id);
  var query = Post.findById(id);
  
  query.exec(function(err, post) {
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }
    
    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res) {
  console.log('/post/:post::', req.post);
  req.post.populate('comment', function(err, post) {
      if (err) { return next(err); }

      res.json(req.post);
  });
});

router.put('/posts/:post/upvote', function(req, res, next) {
    console.log('upvote::', req.post);
    req.post.upvote(function(err, post) {
        if (err) { return next(err); }
        
        res.json(post);
    });
});

router.put('/posts/:post/comments', function(req, res, next) {
    console.log('req.body::', req.body);
    console.log('req.post::', req.post);

    var comment = new Comment(req.body);
    console.log('comment::', comment);
    comment.posts.push(req.post);
    console.log('comment w/post::', comment);

    comment.save(function(err, comment) {
        if (err) {
            console.log('comment.save.err::', err);
            return next(err);
        }
        req.post.comments.push(comment);
        console.log('res.post w/comments::', req.post);
        req.post.save(function(err, post) {
            if (err) { return next(err); }
            
            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvotes', function(req, res, next) {
});

router.param('comment', function(res, req, next, id) {
  console.log('param.comment(id)::', id);
  var query = Comment.findById(id);
  
  query.exec(function(err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }
    
    req.comment = comment;
    return next();
  });
});

router.post('posts/:post/comments/:comment/upvote', function(req, req, next) {
  
});

module.exports = router;
