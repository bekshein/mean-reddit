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

module.exports = router;
