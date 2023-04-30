const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {

  // INDEX
  app.get('/', async (req, res) => {
    const currentUser = req.user;
    try {
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  })

  // NEW
  app.get('/posts/new', (req, res) => {
    const currentUser = req.user;
    res.render('posts-new', { currentUser });
  })

  // CREATE
  app.post('/posts/new', async (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    if (req.user) {
      try {
        const currentUser = req.user;
        const post = new Post(req.body);
        await post.save();
        return res.redirect('/');
      } catch(err) {
        console.log(err.message);
      }
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // SHOW post using :id
    app.get('/posts/:id', async (req, res) => {
        try {
        const post = await Post.findById(req.params.id).lean().populate('comments')
        return res.render('posts-show', { post });
        } catch {
        console.log(err.message);
        }   
    });

  // SUBREDDIT
    app.get('/n/:subreddit', async (req, res) => {
        try {
            let posts = await Post.find({ subreddits: req.params.subreddit }).lean();
            return res.render('posts-index', { posts });
          } catch(err) {
            console.log(err.message);
          }
    });
};