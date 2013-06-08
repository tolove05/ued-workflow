/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-6-8
 * Time: 下午5:52
 * To change this template use File | Settings | File Templates.
 */

define(function (exports, require, module) {

    var taskProcess = require('./show-task-of-process');

    //保存任务进度时的触点
    $(document).on('click', '.J-add-task-of-design-process', function (ev) {
        var form = ev.target.form;

        $.post(form.action, $(form).serialize(), function (data) {
            if (data.status === 1) {
                var first = JSON.parse($('#sidebar li').eq(0).attr('data-json'));
                if (first) taskProcess.showProcess(first)
            } else {
                alert('错误:' + data.msg)
            }
        });

    });

});