var express  = require('express'),
    router   = express.Router(),
    jwt      = require('express-jwt'),
    auth     = jwt({ secret: 'SECRET', userProperty: 'payload' }),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Post     = mongoose.model('Post'),
    Comment  = mongoose.model('Comment'),
    User     = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// register authentication and return JWT token
router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  var newUser = new User();
  newUser.username = req.body.username;
  newUser.setPassword(req.body.password);

  newUser.save(function (err) {
    if (err) { return next(err); }

    return res.json({ token: newUser.generateJWT() });
  });
});

// login authentication and return JWT token
router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

// index all posts
router.get('/posts', function (req, res, next) {
  Post.find(function (err, allPosts) {
    if (err) { return next(err); }

    res.json(allPosts);
  });
});

// create and save new post
router.post('/posts', auth, function (req, res, next) {
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
router.put('/posts/:post/upvote', auth, function (req, res, next) {
  req.post.upvote(function (err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// update post by id using downvote method from Post model (route hits server, runs method and returns back to client)
router.put('/posts/:post/downvote', auth, function (req, res, next) {
  req.post.downvote(function (err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

// create and save new comment on referenced post by id
router.post('/posts/:post/comments', auth, function (req, res, next) {
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

// update comment by id using upvote method from Comment model (route hits server, runs method and returns back to client)
router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
  req.comment.upvote(function (err, comment) {
    if (err) { return next(err); }

    res.json(comment);
  });
});

// update comment by id using downvote method from Comment model (route hits server, runs method and returns back to client)
router.put('/posts/:post/comments/:comment/downvote', auth, function (req, res, next) {
  req.comment.downvote(function (err, comment) {
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
