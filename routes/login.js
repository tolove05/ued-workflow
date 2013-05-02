/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-19
 * Time: 下午4:51
 * To change this template use File | Settings | File Templates.
 */

var app = require('app');
var DB = require('db');


app.post('/login', function (req, res) {

    var body = req.body;

    res.header('content-type', 'text/plain;charset=utf-8');

    var name = body.name;
    var password = body.password;

    var collection = new DB.Collection(DB.Client, 'user');

    collection.findOne({name: name, password: password}, {fields: {_id: 1}}, function (err, docs) {
        if (!err && docs) {
            req.session.name = name;
            req.session._id = docs._id.toString();
            res.redirect('/');
        } else {
            res.end('未找到用户');
        }
    });
});

exports.isLogin = function (req) {
    if (req.session._id) {
        return  req.session._id !== undefined;
    } else {
        return false;
    }
};

//登出
exports.log_out = function (req, res) {
    req.session.destroy();
    res.redirect('/');
};


app.get('/login-out', exports.log_out);