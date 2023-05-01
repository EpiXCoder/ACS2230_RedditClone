const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {
  // NEW REPLY
  app.get('/posts/:postId/comments/:commentId/replies/new', async (req, res) => {
    try {
      const currentUser = req.user;
      const post = await Post.findById(req.params.postId).lean();
      const comment = await Comment.findById(req.params.commentId).lean();
      res.render('replies-new', { post, comment, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

// CREATE REPLY
  app.post('/posts/:postId/comments/:commentId/replies', async (req, res) => {
    try {
      const reply = new Comment(req.body);
      reply.author = req.user._id;
      const post = await Post.findById(req.params.postId);
      const [savedReply, comment] = await Promise.all([
        reply.save(),
        Comment.findById(req.params.commentId),
      ]);
      comment.comments.unshift(savedReply._id);
      await comment.save();
      await post.save();
      res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
      console.error(err);
    }
  });
};