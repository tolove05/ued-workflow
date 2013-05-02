/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-4-22
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */


var app = require('app');
var DB = require('db');


function user() {
    var u = new DB.Collection(DB.Client, 'user');
    u.find({}).toArray(function (err, docs) {
        var user = {};
        docs.forEach(function (u) {
            user[u._id] = u.name;
        });

        exports.user = user;

    });
}

app.get('/user/list', function (req, res) {
    var cb = req.query.callback;
    res.header('content-type', 'application/javascript');
    if (exports.user) {
        res.end(cb + '(' + JSON.stringify(exports.user) + ');');
    } else {
        res.end(cb + '({});');
    }
});

exports.updateUser = user;

DB.runCb(user);


