/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-6-25
 * Time: 下午4:18
 * 显示组长面板
 */

define(function (require, exports, module) {

    var template = require('template/template/1.0.0/template-debug');

    var $document = $(document);

    var tpl = require('./senior-panel-tpl.tpl');

    require('./senior-panel-tpl.css');

    var $senior = $('#senior');
    var $navigation = $('#navigation');

    var group;

    /*当点击导航条上“组长”按钮时，返回所有组长的列表*/
    $navigation.on('click', '.J-group-panel-triggers', function () {
        $.get('/user/group', {
            group: "设计组长"
        }, function (data) {
            $senior.show();
            group = data.data;
            $senior.html(template(tpl, {data: group, step: 1}));
        })
    });

    //点击某位组长，返回组长的所有成员
    $senior.on('click', '.J-group-triggers', function (ev) {
        var $this = $(this);
        $.get('/user/child', {
            senior_id: $this.data('id')
        }, function (data) {
            var users = data.users;
            console.log(users)
            $senior.html(template(tpl, {users: users, step: 2}));
        });
    });

    //当点击某个成员，返回该成员的所有任务列表
    var taskList = require('./show-task-list');

    $document.on('click', '.J-user-triggers', function () {
        taskList.getTaskList($(this).text());
    });

    $document.on('click', function (ev) {
        var $target = $(ev.target);
        if ($target[0].id === 'senior' || $target.parents('#senior').length > 0) {
            return;
        } else {
            $senior.hide();
        }

    });
});