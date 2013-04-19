/*
 * GET home page.
 */

var app = require('app');

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Express',
        name: req.session.name,
        isLogin: require('./login').isLogin(req)
    });
});

require('./add-task');

require('./add-user');

require('./login')

