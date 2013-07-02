/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-23
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $pic = $(document.forms['add-task-of-design-process'].elements['content']);
    var $prviewFile = $('#preview-file');

    //拖进
    $pic.bind('dragenter', function (e) {
        e.preventDefault();
    });

    //存储上传成功的文件
    var uploadList = [];

    //拖来拖去 , 一定要注意dragover事件一定要清除默认事件
    //不然会无法触发后面的drop事件
    $pic.bind('dragover', function (e) {
        e.preventDefault();
    });

    //扔
    $pic.bind('drop', function (e) {
        dropHandler(e);
    });

    var images = [];

    var dropHandler = function (e) {
        //将本地图片拖拽到页面中后要进行的处理都在这
        e.preventDefault();
        var fileList = e.originalEvent.dataTransfer.files;

        Object.keys(fileList).forEach(function (item) {
            var f = fileList[item];
            if (!f.name) return;
            images.push(f);
        });
        uploadImg();
    };

    var fileSize = 150 * 1024 * 1000;

    function uploadImg() {

        if (images.length < 1) return;
        var file = images.shift();

        if (file.size > fileSize) {
            alert('您不能上传大于' + fileSize + '的文件，文件是：' + file.name);
            uploadImg();
            return;
        }

        var id = 'upload-' + Date.now() + '-' + parseInt(Math.random() * 1000000000, 10);

        $('<div id="' + id + '" class="progress">' +
            '<div class="progress-bar progress-bar-info">' +
            '<span class="J-tip tip"></span>' +
            '<span class="J-file-name">' + file.name + '</span>' +
            '<span class="J-process process"></span>' +
            '</div>' +
            '</div>' +
            '').appendTo($('#upload-list'));
        var $li = $('#' + id);
        var formData = new FormData();

        formData.append('file', file);

        var xhr = new XMLHttpRequest();
        var url = '/save-file';

        $li.data('xhr', xhr);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                $li.data('responseText', xhr.responseText);
                try {
                    var serverInfo = JSON.parse(xhr.responseText);
                    insertFile(serverInfo, $li);
                } catch (e) {

                }
            }
        };

        xhr.open('post', url);

        xhr.upload.addEventListener("progress", function (evt) {
            var left = Math.round(evt.loaded * 100 / evt.total) + '%';
            $li.find('.J-process').html(left);
            $li.find('.progress-bar').width(left);
            if (left === '100%') {
                $li.find('.J-tip').html('服务器保存数据中.....');
                $li.addClass('progress-striped active');
            }
        }, false);

        xhr.send(formData);

        if (images.length > 0) uploadImg();
    }

    //当点击删除时，向服务器发送消息，删除掉上传文件所使用的缓存
    $('#upload-list').on('click', 'li', function (ev) {
        var $file = $(ev.currentTarget);
    });

    var $uploadFileField = $('#upload-file-field');
    $uploadFileField.on('change', function (ev) {
        var files = ev.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            images.push(file)
        }

        uploadImg();
    });

    function insertFile(serverInfo, $li) {
        var tpl = '';
        if (serverInfo._id) {
            $li.find('.J-tip').html('上传成功');
            uploadList.push(serverInfo);
            $li.removeClass('progress-striped active').find('.progress-bar').removeClass('progress-bar-info').addClass('progress-bar-success')
        } else {
            $li.find('.J-tip').html('上传失败，失败原因：' + serverInfo.err.join(','));
            $li.removeClass('progress-striped active').find('.progress-bar').removeClass('progress-bar-info').addClass('progress-bar-danger')
        }

        $prviewFile.append($(tpl));
    }

    exports.getUploadList = function () {

    };
    exports.getUploadList = function () {

    };

});
