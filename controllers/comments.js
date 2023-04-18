const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
    // CREATE Comment
    app.post('/posts/:postId/comments', async (req, res) => {
    try {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment(req.body);
            // SAVE INSTANCE OF Comment MODEL TO DB
            await comment.save();

            // Find post by ID
            const post = await Post.findById(req.params.postId);
    
            // Add comment to post comments array and save
            post.comments.unshift(comment);
            await post.save();
    
            // Redirect to home page
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    });
};