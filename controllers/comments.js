const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = (app) => {
    // CREATE Comment
    app.post('/posts/:postId/comments', async (req, res) => {
    try {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);
        comment.author = req.user._id;
        // SAVE INSTANCE OF Comment MODEL TO DB
        await comment.save();
        
        // Find post by ID
        const [post] = await Promise.all([Post.findById(req.params.postId), ]);

        // Add comment to post comments array and save
        post.comments.unshift(comment);
        await post.save();
        const comments = await Comment.find().populate('author', 'username');

        // Redirect
        res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
        console.log(err);
    }
    });
};