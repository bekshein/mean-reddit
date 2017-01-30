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

postSchema.methods.upvote = function (cb) {
  this.upvotes += 1;
  this.save(cb);
};

postSchema.methods.downvote = function (cb) {
  this.downvotes += 1;
  this.save(cb);
};

mongoose.model('Post', postSchema);
