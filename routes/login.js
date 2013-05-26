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

    collection.findOne({name: name, pwd: pwd}, {fields: {_id: 1, group: 1}}, function (err, docs) {
        if (!err && docs) {
            req.session.name = name;
            req.session._id = docs._id.toString();
            res.end(JSON.stringify(docs));
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

//第一次登陆
app.post('/login/init-user', function (req, res) {

    var serverInfo = {
        err: []
    };

    var body = req.body;

    if (!body.user || !/^\S{2,}$/.test(body.user)) {
        serverInfo.err.push('用户名格式不正确');
        res.json(serverInfo);
        return;
    }

    var validator_pwd_re = /^[0-9a-z]{128}$/;

    if (!body.pwd1 || !body.pwd2 || !validator_pwd_re.test(body.pwd1) || !validator_pwd_re.test(body.pwd2)) {
        serverInfo.err.push('密码信息不符合规范');
        res.json(serverInfo);
        return;
    }

    //检查user表中是否已经有记录，如有，则表示当前请求非法

    //首先查看任务单中是否有任务
    var collection = new DB.Collection(DB.Client, 'task');

    collection.findOne({to: body.user}, {fields: {_id: 1}}, function (err, docs) {

        if (!err && docs === null) {
            //开始查询用户是否已经初始化
            var user = new DB.Collection(DB.Client, 'user');
            console.log('开始' + body.user)
            user.findOne({name: body.user}, {fields: {_id: 1}}, function (err, docs) {
                if (!err && docs) {
                    serverInfo.status = -1;
                    serverInfo.err.push('该用户已经存在，无须初始化')
                    res.json(serverInfo);
                } else {
                    //开始保存用户
                    user.insert({
                        name: body.user,
                        pwd: body.pwd1,
                        time_stamp: Date.now(),
                        group: ['设计师']
                    }, {safe: true}, function (err, docs) {
                        if (!err && docs) {
                            serverInfo.status = 1;
                            serverInfo.docs = docs;
                            res.json(serverInfo);
                        } else {
                            serverInfo.status = -2;
                            serverInfo.err.push('无法初始化用户' + err);
                            res.json(serverInfo);
                        }
                    })
                }
            })
        } else {
            serverInfo.status = -3;
            serverInfo.err.push('无法验证用户');
            res.json(serverInfo);
        }
    });
});
