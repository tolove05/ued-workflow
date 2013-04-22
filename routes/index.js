/*
 * GET home page.
 */

var app = require('app');
var DB = require('db');

app.get('/', function (req, res) {

    var collection = new DB.Collection(DB.Client, 'task');

    collection.find({}, {}).sort([
            ['time_stamp', -1]
        ]).toArray(function (err, docs) {
            res.render('index', {
                title: 'Express',
                name: req.session.name,
                isLogin: require('./login').isLogin(req),
                docs: docs
            });
        });

});

require('./add-task');

require('./add-user');

require('./login');

require('./task');

require('./user');
