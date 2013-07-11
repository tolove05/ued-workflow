/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:14
 * 把该用户的所有页面都查询出来
 */

define(function (require, exports, module) {


    var tpl = require('./show-task-list.tpl');
    var template = require('template/template/1.0.0/template-debug');

    exports.getTaskList = function (user) {
        $.getJSON('/task-of-design/list/' + user, function (res) {
            $('#task-list').html(template(tpl, res));
        });
    }

});