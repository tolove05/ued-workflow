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
                li += '<li>' + user[item.user_id] + ',' + item.content + (new Date(item.time_stamp).toLocaleString()) + '</li>';
            })
            $('#list').html(li);
        });
    });
});
