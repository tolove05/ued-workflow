/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-23
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */

define(function (exports, require, module) {

    var $pic = $(document.forms['add-task-process'].elements['content']);
    var cl;

    //拖进
    $pic.bind('dragenter', function (e) {
        e.preventDefault();
    });

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

    function uploadImg() {

        var file = images.shift();
        if (!file) return;

        var id = 'upload-' + Date.now() + '-' + parseInt(Math.random() * 1000000000, 10);

        $('<li id="' + id + '">' +
            file.name +
            '<div class="progress progress-striped" style="height:32px;">' +
            '<div class="progress-bar" style="width: 0%"></div>' +
            '</div>' +
            '<b class="process"></b>' +
            '<b class="response"></b>' +
            '<button class="btn btn-mini btn-danger" data-action="delete" type="button">删除这个文件</button>' +
            '</li>' +
            '').appendTo($('#upload-list'));
        var $li = $('#' + id);
        var formData = new FormData();

        formData.append('file', file);

        var xhr = new XMLHttpRequest();
        var url = '/save-file';

        $li.data('xhr', xhr);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                $li.addClass('success');
                $li.find('.progress-bar').addClass('progress-bar-success');
                $li.data('responseText', xhr.responseText);
            }
        };

        xhr.open('post', url);

        xhr.upload.addEventListener("progress", function (evt) {
            var percent = Math.round(evt.loaded * 100 / evt.total);
            console.log(percent)
            $li.find('.progress-bar').css('width', percent + '%');
        }, false);

        xhr.send(formData);

        if (cl) {
            clearTimeout(cl);
            cl = undefined;
        }
        if (images.length > 0) uploadImg();
    }

    //当点击删除时，向服务器发送消息，删除掉上传文件所使用的缓存
    $('#upload-list').on('click', 'li', function (ev) {
        var $li = $(ev.currentTarget);
    });

});