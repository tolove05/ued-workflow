/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-6-18
 * Time: 上午10:07
 * 添加子成员
 */

var app = require('app');
var DB = require('db');
var user = require('user');

function trans(s) {
    return s && s.trim().length > 0 ? s.trim() : undefined;
}

app.post('/add-child-members', function (req, res) {

    var body = req.body;
    var serverInfo = {err: []};

    if (!require('./login').isLogin(req)) {
        serverInfo.status = 0;
        serverInfo.err.push('请先登陆');
        res.json(serverInfo);
        return;
    }

    //检测所指定的用户是否存在

    var collection = new DB.Collection(DB.Client, 'user');

    var name = trans(body.name);
    if (name === undefined) {
        serverInfo.status = -1;
        serverInfo.err.push('下属名称不能为空');
        res.json(serverInfo);
        return;
    }

    //设计组长才能访问此路由
    collection.findOne({_id: DB.mongodb.ObjectID(req.session._id)}, {fields: {group: 1}}, function (err, data) {
        if (data && data.group.indexOf('设计组长') > -1) {

            //检测是否为有效用户
            var child_id = undefined;
            Object.keys(user.user).some(function (item) {
                if (user.user[item] === name) child_id = item;
            });

            if (child_id === undefined) {
                serverInfo.status = -2;
                serverInfo.err.push('该用户不存在');
                res.json(serverInfo);
                return;
            }

            if (child_id === req.session._id) {
                serverInfo.status = -3;
                serverInfo.err.push('自己不能做自己下属哦');
                res.json(serverInfo);
                return;
            }

            //检查角色是否为设计师，只有设计师才能被设计组长添加为下属
            collection.findOne({
                _id: DB.mongodb.ObjectID(child_id),
                group: {
                    $in: ["设计师"]
                }
            }, { group: 1 }, function (err, result) {

                if (result === null) {
                    serverInfo.status = -4;
                    serverInfo.err.push('该成员不属于设计师');
                    res.json(serverInfo);
                    return;
                }

                //防止该成员被重复指定上级
                collection.findOne({
                    _id: DB.mongodb.ObjectID(child_id),
                    senior: {
                        $elemMatch: {
                            _id: req.session._id,
                            //查询当前是否已经有权限了
                            disable_id: {
                                $exists: false
                            }
                        }
                    }
                }, {
                    group: 1
                }, function (err, result) {

                    if (result !== null) {
                        serverInfo.status = -5;
                        serverInfo.err.push('您之前已经添加过了！');
                        res.json(serverInfo);
                        return;
                    }

                    collection.update({
                        _id: DB.mongodb.ObjectID(child_id)
                    }, {
                        $push: {
                            "senior": {
                                _id: req.session._id,
                                enable_id: req.session._id,
                                enable_time: Date.now()
                            }
                        }}, {}, function (err, result) {
                        serverInfo.status = 1;
                        serverInfo.msg = '添加成功';
                        res.json(serverInfo);
                    });
                });
            })


        } else {
            serverInfo.status = -1;
            serverInfo.err.push('未授权访问');
            res.json(serverInfo);
        }
    });
});
