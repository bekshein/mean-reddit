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

module.exports = router;
