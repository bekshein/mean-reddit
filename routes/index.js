var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose'),
    Post     = mongoose.model('Post'),
    Comment  = mongoose.model('Comment'),

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
