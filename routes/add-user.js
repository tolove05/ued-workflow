/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-19
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var app = require('app');
var DB = require('db');

function trans(s) {
    return s && s.trim().length > 0 ? s.trim() : undefined;
}

//只有管理员组权限，才能访问此路由

app.post('/add-user', function (req, res) {

    var body = req.body;
    var serverInfo = {err: []};

    if (!require('./login').isLogin(req)) {
        serverInfo.err.push('请先登陆')
        res.json(serverInfo);
        return;
    }

    var user = {
        name: trans(body.name),
        pwd: trans(body.pwd),
        group: trans(body.group)
    };

    if (!user.name || !user.pwd || !user.group || !/^[a-z0-9]{128}$/.test(user.pwd)) {
        serverInfo.err.push('参数错误');
        res.json(serverInfo);
        return;
    }

    user.group = [user.group];

    var collection = new DB.Collection(DB.Client, 'user');

    //首先查询当前请求的用户，是否具有管理员权限
    collection.findOne({_id: DB.mongodb.ObjectID(req.session._id)}, {fields: {group: 1}}, function (err, data) {
        if (data && data.group.indexOf('管理员') > -1) {
            collection.findOne({name: user.name}, function (err, data) {
                if (!err && data) {
                    serverInfo.err.push('用户已经存在了');
                    res.json(serverInfo);
                } else {
                    collection.insert(user, {safe: true},
                        function () {
                            serverInfo.status = 0;
                            serverInfo.msg = user.name + '添加成功，可以以此帐号登陆了';
                            res.json(serverInfo);
                            //更新用户缓存
                            require('user').updateUser();
                        });
                }
            });
        } else {
            serverInfo.err.push('未授权访问');
            res.json(serverInfo);
        }
    });
});

