/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:21
 * 显示任务的进度详情
 */

define(function (require, exports, module) {

    var urlRule = /^#task\//;

    $('#sidebar').on('mousedown', '.J-task-trigger', function (ev) {
        var $this = $(this);
        window.location.hash = 'task/' + JSON.stringify({_id: $this.data('_id')});
        showProcess();
    });

    var template = require('template/template/1.0.0/template-debug');

    var user = require('user/list?callback=define');

    var tpl = require('./task-of-process-tpl.tpl');

    function showProcess() {
        try {
            var param = JSON.parse(window.location.hash.replace(urlRule, ''));
        } catch (e) {
            return;
        }
        var _id = param._id;
        $('#add-task-of-process-id').val(_id);
        $.getJSON('/task-of-design/process/' + _id + '?r=' + Math.random(), function (res) {
            var html = template(tpl, {data: res.data, user: user});
            $('#content').html(html);
            exports.showPermissions(res);
        });
        $('div.J-task-list a').removeClass('active').filter('[data-_id=' + _id + ']').addClass('active');
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

    $(window).on('hashchange', function (ev) {
            if (urlRule.test(window.location.hash))   showProcess();
        }
    );

    if (urlRule.test(window.location.hash))  showProcess();

});

