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

    var body = req.body;

    var user = {
        //任务名
        name: trans(body.name),
        password: trans(body.password)
    };

    if (!user.name || !user.password) {
        res.end('参数错误');
        return;
    }

    var collection = new DB.Collection(DB.Client, 'user');
    collection.insert(user, {safe: true},
        function () {
            res.end('用户保存成功');
        });

});