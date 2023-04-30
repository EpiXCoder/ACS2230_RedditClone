const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    // SIGN UP FORM
    app.get('/sign-up', (req, res) => res.render('sign-up'));
    // SIGN UP POST
    app.post('/sign-up', async (req, res) => {
        // Create User
        try {
            const user = await new User(req.body);
            const savedUser = await user.save();
            const token = await jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            return res.redirect('/');
        } catch(err) {
            console.log(err.message);
            return res.status(400).send({ err });
        }
    });
    // LOGOUT
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        return res.redirect('/');
      });
  };