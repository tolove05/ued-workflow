/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    $('#sidebar').on('click', 'li', function (ev) {
        var data = ev.currentTarget.getAttribute('data-json');
        if (!data) return;
        showProcess(JSON.parse(data));
    });

    var template = require('template/template/1.0.0/template-debug');

    var user = require('user/list?callback=define');

    var tpl = require('/task/task-process-tpl.tpl#');

    function showProcess(data) {
        $('#container .task-title').html(data.name);
        $('#add-task-process-id').val(data._id);
        $.getJSON('/task/process/' + data._id, function (res) {
            var html = template(tpl, {data: res.data, user: user});
            $('#content').html(html)
        })

    }
});

