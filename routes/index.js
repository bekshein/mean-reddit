var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Post     = mongoose.model('Post'),
    Comment  = mongoose.model('Comment'),

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// index all posts
router.get('/posts', function (req, res, next) {
  Post.find(function (err, allPosts) {
    if (err) { return next(err); }

    res.json(allPosts);
  });
});

// create and save new post
router.post('/posts', function (req, res, next) {
  var newPost = new Post(req.body);

  newPost.save(function (err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// middleware function to preload post object to handle post ID routes (will retrieve and attach post object to the req object for route handlers with :post route parameter)
router.param('post', function (req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

// middleware function to preload comment object to handle comment ID routes (will retrieve and attach comment object to the req object for route handlers with :comment route parameter)
router.param('comment', function (req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

// show post by id
router.get('/posts/:post', function (req, res) {
  req.post.populate('comments', function (err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// update post by id using upvote method from Post model (route hits server, runs method and returns back to client)
router.put('/posts/:post/upvote', function (req, res, next) {
  req.post.upvote(function (err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// update post by id using downvote method from Post model (route hits server, runs method and returns back to client)
router.put('/posts/:post/downvote', function (req, res, next) {
  req.post.downvote(function (err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// create and save new comment on referenced post by id
router.post('/posts/:post/comments', function (req, res, next) {
  var newComment = new Comment(req.body);
  newComment.post = req.post;

  newComment.save(function (err, comment) {
    if (err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function (err, post) {
      if (err) { return next(err); }

      res.json(comment);
    });
  });
});
module.exports = router;
