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
    return s && s.trim().length > 0 ? s.trim() : '';
}

app.post('/add-task', function (req, res) {

    console.log(req.body);
    var serverInfo = {
        err: []
    };

    try {
        var json = JSON.parse(req.body.json);
    } catch (e) {
        serverInfo.err.push('提交的数据格式非法');
        return;
    }

    var TASK = [];

    json.data.forEach(function (item) {

        var task = {
            //给谁,记录ObjectId
            to: trans(item[0]),
            //任务名
            name: trans(item[1]),
            //需求方
            demand_side: trans(item[2]),
            //小时数
            timer: trans(item[3]),
            //任务类型
            type: trans(item[4]),
            //派发者，记录ObjectId
            from: req.session._id,
            //时间戳
            time_stamp: Date.now()
        };

        var arr = [];

        if (task.to.length < 1) arr.push('您必须指定任务的完成者');
        if (task.name.length < 1) arr.push('任务名称不能为空');
        if (task.demand_side.length < 1) arr.push('缺少需求方名称');
        if (/^[^0]\d*$/ === false) arr.push('任务时常为空或不正确');
        if (task.type.length < 1) arr.push('缺少任务类型');

        if (arr.length < 1) {
            TASK.push(task)
        } else {
            serverInfo.err.push(item + '存在问题' + arr.join(','));
        }
    });

    res.header('content-type', 'text/plain;charset=utf-8');

    res.json({task: TASK});

    console.log(TASK)
    return;
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
            //任务类型
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