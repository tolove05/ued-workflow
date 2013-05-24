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

    var serverInfo = {
        err: []
    };

    res.header('content-type', 'text/plain;charset=utf-8');

    if (!require('./login').isLogin(req)) {
        serverInfo.err.push('请先登陆')
        res.json(serverInfo);
        return;
    }

    try {
        var json = JSON.parse(req.body.json);
    } catch (e) {
        serverInfo.err.push('提交的数据格式非法');
        res.json(serverInfo);
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
            time_stamp: Date.now(),
            //
            category:''//1 设计师任务，2：前端任务
            
        };

        var arr = [];

        if (task.to.length < 1) arr.push('您必须指定任务的完成者');
        if (task.name.length < 1) arr.push('任务名称不能为空');
        if (task.demand_side.length < 1) arr.push('缺少需求方名称');
        task.timer = parseInt(task.timer, 10);
        if (isNaN(task.timer) || task.timer < 1) arr.push('任务时长必须大于0');
        if (task.type.length < 1) arr.push('缺少任务类型');

        if (arr.length < 1) {
            TASK.push(task)
        } else {
            serverInfo.err.push(item + '存在问题：' + arr.join(','));
        }
    });

    //如果任意一条数据存在错误，则拒绝保存
    if (serverInfo.err.length > 0) {
        res.json(serverInfo);
        return;
    }

    var user = new DB.Collection(DB.Client, 'user');
    user.findOne({_id: DB.mongodb.ObjectID(req.session._id)}, function (err, data) {
        if (err) {
            res.end('您没有权限添加任务单');
            return;
        }

        if (data && data.group !== '9') {
            res.end('您没有权限');
            return;
        }

        var collection = new DB.Collection(DB.Client, 'task');
        collection.insert(TASK, {safe: true},
            function () {
                serverInfo.msg = '保存成功';
                serverInfo.success = true;
                res.json(serverInfo);
            });
    });

});
