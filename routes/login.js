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
    var pwd = body.pwd;

    var collection = new DB.Collection(DB.Client, 'user');

    collection.findOne({name: name, pwd: pwd}, {fields: {_id: 1}}, function (err, docs) {
        if (!err && docs) {
            req.session.name = name;
            req.session._id = docs._id.toString();
            res.end(JSON.stringify({_id: docs._id, name: require('user').user[docs._id]}));
        } else {
            res.end('{}');
        }
    });
});

exports.isLogin = function (req) {
    if (req.session._id) {
        return  req.session._id !== 'undefined';
    } else {
        return false;
    }
};

//登出
app.get('/login-out', function (req, res) {
    req.session.destroy();
    res.end();
});

//检测是否登陆
app.get('/check-login', function (req, res) {
    if (exports.isLogin(req)) {
        res.end(JSON.stringify({_id: req.session._id, name: require('user').user[req.session._id]}));
    } else {
        res.end('{}');
    }
});
