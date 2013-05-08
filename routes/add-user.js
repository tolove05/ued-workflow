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

app.post('/add-user', function (req, res) {

    res.header('content-type', 'text/plain;charset=utf-8');

    var body = req.body;

    var user = {
        //任务名
        name: trans(body.name),
        pwd: trans(body.pwd),
        group: trans(body.group)
    };

    //密码必须是一个SHA512 (128长度) 的值，请在客户端效验好后再传送
    if (!user.name || !user.pwd || !user.group || !/^[a-z0-9]{128}$/.test(user.pwd)) {
        res.end('参数错误');
        return;
    }

    var collection = new DB.Collection(DB.Client, 'user');

    collection.insert(user, {safe: true},
        function () {
            res.end('用户保存成功');
            //更新用户缓存
            require('user').updateUser();
        });

});

