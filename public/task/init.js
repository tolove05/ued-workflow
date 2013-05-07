/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-22
 * Time: 下午5:09
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var id = window.location.href.match(/\/task\/([a-z0-9]{24})/);

    seajs.use('/user/list?callback=define&t' + Date.now(), function (user) {
        if (!id || !id[1]) return;

        $.getJSON('/task/list/' + id[1], function (data) {
            var li = '';
            $(data.data).each(function (i, item) {

                li += '<div class="ds-post-main"><div class="ds-avatar">' +
                    '<a><img src="http://tp3.sinaimg.cn/1750584642/50/5612846168/1"></a>' +
                    '</div>' +
                    '<div class="ds-comment-body">' +
                    '<a  class="user-name">' + user[item.user_id] + '</a>' + item.content +
                    (item.files ? item.files.join('<br>') : '') +
                    '</div></div>'
            })
            $('#list').html(li);
        });
    });

    require('./upload');

    require('./sidebar-init');

    require('./show-task-process');

    require('./add-task');

});
