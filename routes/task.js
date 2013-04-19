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

    var task = new DB.Collection(DB.client, 'task');

    task.findOne({_id: _id}, {}, function (err, docs) {
        if (docs !== null) {
            res.render('task', {title: 'TASK', docs: docs, html: JSON.stringify(docs, undefined, '\t')});
        } else {
            res.end('Not Found');
        }
    });


});





