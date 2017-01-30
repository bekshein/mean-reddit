var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  body: String,
  author: String,
  date: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

mongoose.model('Comment', commentSchema);
