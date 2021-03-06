/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-4-19
 * Time: 下午9:28
 * To change this template use File | Settings | File Templates.
 */

var app = require('app');

var DB = require('db');

//获取设计师任务的详情
app.get(/^\/task-of-design\/([a-z0-9]{24})$/, function (req, res) {

    try {
        var _id = DB.mongodb.ObjectID(req.params[0]);
    } catch (e) {
        res.end('_id error');
        return;
    }

    if (!require('./login').isLogin(req)) {
        res.end('请先登陆');
        return;
    }
    elseif(1)
    {
    }

    var task = new DB.Collection(DB.Client, 'task-of-design');

    task.findOne({_id: _id}, {}, function (err, docs) {
        if (docs !== null) {
            res.render('task', {title: 'TASK', docs: docs, _id: _id, html: JSON.stringify(docs, undefined, '\t')});
        } else {
            res.end('Not Found');
        }
    });

});


/*添加计划任务*/

function trim(s) {
    return typeof s === 'string' && s.trim().length > 0 ? s.trim() : undefined;
}

//保存任务的进度
app.post('/add-task-of-design-process', function (req, res) {

    var serverResult = {
        err: []
    };

    if (!req.session._id) {
        serverResult.err.push('需要登陆才能完成此操作');
        serverResult.status = 0;
        res.json(serverResult);
        return;
    }

    var body = req.body;
    var data = {
        //类型
        type: parseInt(body.type, 10),
        //意见
        content: trim(body.content),
        //针对的任务
        task_id: trim(body._id),
        //谁发表的意见
        user_id: req.session._id,
        time_stamp: Date.now()
    };

    if (data.content === undefined) {
        delete data.content;
    }

    if (body.files) {
        data.files = body.files
    }

    /*
     1:普通发表回复
     2:请求上级审核
     3:返回修改
     4:通过
     5:关闭此需求
     */
    if (isNaN(data.type) || data.type < 0 || !data.task_id || !/^[a-z0-9]{24}$/.test(data.task_id)) {
        serverResult.err.push('参数验证不通过');
        serverResult.status = -1;
        res.json(serverResult);
        return;
    }

    var task = new DB.Collection(DB.Client, 'task-of-design-process');

    task.insert(data, {safe: true}, function (err, docs) {
        if (!err && docs) {
            serverResult.status = 1;
            serverResult.docs = docs[0];
        } else {
            serverResult.status = -2;
            serverResult.err.push('未能添加任务进度')
        }
        res.json(serverResult);
    });

});


app.get(/^\/task-of-design\/process\/([a-z0-9]{24})$/, function (req, res) {

    var serverResult = {
        err: []
    };

    if (!req.session._id) {
        serverResult.err.push('需要登录');
        serverResult.status = 0;
        res.json(serverResult);
        return;
    }


    try {
        var _id = DB.mongodb.ObjectID(req.params[0]);
    } catch (e) {
        serverResult.err.push('参数不合法');
        serverResult.status = -1;
        res.json(serverResult);
        return;
    }

    var list = new DB.Collection(DB.Client, 'task-of-design-process');

    var task = new DB.Collection(DB.Client, 'task-of-design');

    //首先查询出该任务的实现者
    task.findOne({
        _id: _id
    }, { }, function (err, result) {

        if (result === null) {
            serverResult.status = -2;
            serverResult.err.push('任务不存在');
            res.json(serverResult);
            return;
        }

        var task = result;

        //查询当前登陆用户，是否为该任务执行者的上级
        //执行该步骤后，才能判断出当前登陆者针对该任务所拥有的权限
        var user = new DB.Collection(DB.Client, 'user');

        var task_user_name = result.to;
        user.findOne({
            name: task_user_name
        }, {_id: 1, group: 1, name: 1}, function (err, result) {

            if (result === null) {
                serverResult.status = -3;
                serverResult.err.push('该用户尚未完成初次登陆，请通知对方对方完成第一次登陆');
                res.json(serverResult);
                return;
            }

            //当前任务是否为自己的任务
            var isOwn = result._id.toString() === req.session._id;

            var taskUserGroup = result.group;

            //开始查询当前登陆用户和该任务单执行者的权限关系
            //查询当前用户

            //查询指派任务的用户
            user.findOne({
                name: task_user_name,
                senior: {
                    $elemMatch: {
                        _id: req.session._id,
                        disable_id: {
                            $exists: false
                        }
                    }
                }
            }, {
                _id: 0,
                group: 1
            }, function (err, result) {

                // 如果是上级或者属于[设计审核]组
                var isSenior = result !== null || req.session.group.indexOf('设计审核') > -1;

                list.find({task_id: req.params[0]}).sort([
                        ['time_stamp', 1]
                    ]).toArray(function (err, docs) {
                        res.json({
                            status: 1,
                            data: docs,
                            isSenior: isSenior,
                            task: task, //是否该任务的拥有者
                            isOwn: isOwn,
                            taskUserGroup: taskUserGroup
                        })
                    })
            })
        });
    });
})
;


app.get(/^\/task-of-design\/list\/(\S+)/, function (req, res) {

    var list = new DB.Collection(DB.Client, 'task-of-design');

    var result = {
        err: []
    };

    if (!require('./login').isLogin(req)) {
        result.status = -2;
        result.err.push('未授权')
        res.json(result);
        return;
    }

    list.find({to: req.params[0]}).sort([
            ['time_stamp', 1]
        ]).toArray(function (err, docs) {
            if (req.query.callback) {
                res.end(req.query.callback + '(' + JSON.stringify({data: docs}, undefined, '    ') + ');');
            } else {
                res.end(JSON.stringify({data: docs}, undefined, '    '));
            }
        });

});

