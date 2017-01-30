var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  author: String,
  link: String,
  date: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('Post', postSchema);
