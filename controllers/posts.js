const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {

  // INDEX
  app.get('/', async (req, res) => {
    const currentUser = req.user;
    try {
      const posts = await Post.find({}).lean().populate('author');
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
        const userId = req.user._id;
        const currentUser = req.user;
        const post = new Post(req.body);
        post.author = userId;
        await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(post);
        await user.save();
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
        const currentUser = req.user;
        const post = await Post.findById(req.params.id).lean().populate({ path:'comments', populate: { path: 'author' } }).populate('author')
        return res.render('posts-show', { post, currentUser });
        } catch {
        console.log(err.message);
        }   
    });

  // SUBREDDIT
    app.get('/n/:subreddit', async (req, res) => {
        try {
          const currentUser = req.user;
          let posts = await Post.find({ subreddits: req.params.subreddit }).lean().populate('author');
          return res.render('posts-index', { posts, currentUser });
        } catch(err) {
          console.log(err.message);
        }
    });
};