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

app.post('/add-task', function (req, res) {

    res.header('content-type', 'text/plain;charset=utf-8');

    if (!require('./login').isLogin(req)) {
        res.end('请先登录');
        return;
    }

    var body = req.body;
    var user = new DB.Collection(DB.Client, 'user');
    user.findOne({_id: DB.mongodb.ObjectID(req.session._id)}, function (err, data) {
        if (err) {
            res.end('出错');
            return;
        }

        if (data && data.group !== '9') {
            res.end('您没有权限');
            return;
        }

        var task = {
            //任务名
            name: trans(body.name),
            //给谁,记录ObjectId
            to: trans(body.to),
            //需求方
            demand_side: trans(body.demand_side),
            //小时数
            timer: trans(body.timer),
            //备注
            note: trans(body.note),
            //派发者，记录ObjectId
            from: req.session._id,
            //时间戳
            time_stamp: Date.now()
        };

        //任务名称，指派者，被指派者必须存在
        if (!task.name || !task.to || !task.from) {
            res.end('参数错误');
            return;
        }

        var collection = new DB.Collection(DB.Client, 'task');
        collection.insert(task, {safe: true},
            function () {
                res.end('保存成功');
            });
    });

});