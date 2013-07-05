/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:21
 * 显示任务的进度详情
 */

define(function (require, exports, module) {

    $('#sidebar').on('mousedown', '.J-task-trigger', function (ev) {
        var $this = $(this);
        $this.addClass('active').siblings().removeClass('active');
        window.location.hash = $this.data('_id');
        showProcess($this);
    });

    var template = require('template/template/1.0.0/template-debug');

    var user = require('user/list?callback=define');

    var tpl = require('./task-of-process-tpl.tpl');

    function showProcess($this) {
        var _id = $this.data('_id');
        $('#container').find('.task-title').html($this.text());
        $('#add-task-of-process-id').val(_id);
        $.getJSON('/task-of-design/process/' + _id + '?r=' + Math.random(), function (res) {
            var html = template(tpl, {data: res.data, user: user});
            $('#content').html(html);
            exports.showPermissions(res);
        })
    }

    exports.showProcess = showProcess;

    //相应改变当前登陆者，所拥有的权限
    exports.showPermissions = function (data) {
        var template = require('template/template/1.0.0/template-debug');
        var tpl = require('./show-task-of-process.tpl');
        var form = document.forms['add-task-of-design-process'];
        var select = form.elements['type'];
        select.innerHTML = template(tpl, data)
        $(document.forms['add-task-of-design-process']).show();
    };
});

