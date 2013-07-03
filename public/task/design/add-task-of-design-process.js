/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-6-8
 * Time: 下午5:52
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var taskProcess = require('./show-task-of-process');

    var $uploadList = $('#upload-list');

    //保存任务进度时的触点
    $(document).on('click', '.J-add-task-of-design-process', function (ev) {
        var form = ev.target.form;

        var err = [];

        if (/^\d+$/.test(form.elements['type'].value) == false) {
            err.push('情选择操作类型')
        }

        if ($uploadList.find('div.J-uploading').length > 0) {
            err.push('请等待文件上传完成')
        }

        if (err.length > 0) {
            $(form).find('.J-alert').show();
            $(form).find('.J-alert').html(err.join('<br>'))
            return;
        }

        var upload = require('./upload');

        var files = upload.getUploadList();
        var data = {
            type: form.elements['type'].value,
            _id: form.elements['_id'].value,
            content: form.elements['content'].value
        };

        if (files.length > 0) {
            data.files = files;
        }

        $.post(form.action, data, function (data) {
            if (data.status === 1) {
                taskProcess.showProcess($('#sidebar a.J-task-trigger.active'));
                form.reset();
                $('#preview-file,#upload-list');
                $('#upload-list').html('');
                upload.clearUploadList();
                $(form).find('.J-alert').hide();
            } else {
                alert('错误:' + data.msg)
            }
        });

    });

});