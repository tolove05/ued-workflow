/*
 * GET home page.
 */

var app = require('app');
var DB = require('db');

app.get('/', function (req, res) {

    res.render('index', {
        title: 'Express',
        name: req.session.name,
        isLogin: require('./login').isLogin(req),
        user: require('user').user
    });
});

require('./add-task');

require('./add-user');

require('./login');

require('./task');

require('./user');

require('./save-file')