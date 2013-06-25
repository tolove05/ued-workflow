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

require('./add-task-design');

require('./add-user');

require('./add-child-members');

require('./login');

require('./task-of-design');

require('./user');

require('./save-file')