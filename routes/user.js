/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-4-22
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */


var app = require('app');
var DB = require('db');


function user() {
    var u = new DB.Collection(DB.Client, 'user');
    u.find({}).toArray(function (err, docs) {
        var user = {};
        docs.forEach(function (u) {
            user[u._id] = u.name;
        });

        exports.user = user;

    });
}

app.get('/user/list', function (req, res) {
    var cb = req.query.callback;
    res.header('content-type', 'application/javascript');
    if (exports.user) {
        res.end(cb + '(' + JSON.stringify(exports.user) + ');');
    } else {
        res.end(cb + '({});');
    }
});


/*根据组名，返回该组所有成员*/
app.get('/user/group', function (req, res) {

    var group_name = req.query.group;


    var result = {err: []};

    if (typeof group_name !== 'string') {
        result.status = -1;
        result.err.push('需要组名');
        res.json(result);
        return;
    }

    var user = new DB.Collection(DB.Client, 'user');

    user.find({group: {$in: [group_name]}}, {_id: 1, name: 1, group: 1}).toArray(function (err, docs) {
        result.status = 1;
        result.data = docs;
        res.json(result);
    });

});

//获取某个用户下的所有子用户
app.get('/user/child', function (req, res) {

    var senior_id = req.query.senior_id;

    var result = {err: []};

    if (typeof senior_id !== 'string') {
        result.status = -1;
        result.err.push('需要上级id方可查询子成员');
        res.json(result);
        return;
    }

    var user = new DB.Collection(DB.Client, 'user');

    user.find({
        senior: {
            $elemMatch: {
                _id: senior_id,
                //只返回有效的上级（disable_id如果存在，表示该组员脱离了组长）
                //disable_id表示执行脱离组长操作的用户id
                disable_id: {
                    $exists: false
                }
            }
        }
    }, {_id: 1, name: 1, group: 1}).toArray(function (err, docs) {
            result.status = 1;
            result.users = docs;
            res.json(result);
        });


});


exports.updateUser = user;

DB.runCb(user);


