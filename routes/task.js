/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-4-19
 * Time: 下午9:28
 * To change this template use File | Settings | File Templates.
 */

var app = require('app');

var DB = require('db');

app.get(/^\/task\/([a-z0-9]{24})$/, function (req, res) {

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

    var task = new DB.Collection(DB.Client, 'task');

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

app.post('/add-task-process', function (req, res) {

    var body = req.body;
    var data = {
        //任务意见
        content: trim(body.content),
        //任务id
        task_id: trim(body._id),
        //谁发表的意见
        user_id: req.session._id,
        time_stamp: Date.now()
    };

    if (!data.content || !data.task_id || !/^[a-z0-9]{24}$/.test(data.task_id)) {
        res.end('参数错误');
        return;
    }

    var task = new DB.Collection(DB.Client, 'task-process');

    task.insert(data, {safe: true}, function (err, docs) {
        res.redirect('back');
    });
});


app.get(/^\/task\/list\/([a-z0-9]{24})$/, function (req, res) {

    var user = require('user');

    var _id = req.params[0];

    var list = new DB.Collection(DB.Client, 'task-process');
    list.find({task_id: _id}).sort([
            ['time_stamp', -1]
        ]).toArray(function (err, docs) {
            res.end(JSON.stringify({data: docs}, undefined, '    '))
        });

});