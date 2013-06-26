/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:21
 * 显示任务的进度详情
 */

define(function (require, exports, module) {

    $('#sidebar').on('mousedown', 'li', function (ev) {
        var $this = $(this);
        $this.addClass('checked').siblings().removeClass('checked');
        var data = $this.data('data');
        window.location.hash = data._id;
        showProcess(data);
    });

    var template = require('template/template/1.0.0/template-debug');

    var user = require('user/list?callback=define');

    var tpl = require('./task-of-process-tpl.tpl');

    function showProcess(data) {
        $('#container .task-title').html(data.name);
        $('#add-task-of-process-id').val(data._id);
        $.getJSON('/task-of-design/process/' + data._id + '?r=' + Math.random(), function (res) {


            //

            var html = template(tpl, {data: res.data, user: user});
            $('#content').html(html)
        })

    }

    exports.showProcess = showProcess;

});

