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

    var body = req.body;

    var task = {
        //任务名
        name: trans(body.name),
        //设计师
        stylist: trans(body.stylist),
        //需求方
        demand_side: trans(body.demand_side),
        //小时数
        timer: trans(body.timer),
        //备注
        note: trans(body.note)
    };

    if (!task.name || !task.stylist || !task.demand_side || !task.timer || !task.note) {
        res.end('参数错误');
        return;
    }

    var collection = new DB.Collection(DB.client, 'task');
    collection.insert(task, {safe: true},
        function () {
            res.end('保存成功');
        });

});