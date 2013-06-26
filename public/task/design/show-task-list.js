/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:14
 * 初始化侧边栏的任务列表
 */

define(function (require, exports, module) {
    exports.getTaskList = function (user) {
        $.getJSON('/task-of-design/list/' + user, function (res) {
            var li = document.createDocumentFragment();
            for (var i = 0; i < res.data.length; i++) {
                var item = res.data[i];
                var _li = document.createElement('li');
                _li.innerHTML = item.name;
                $(_li).data('data', item);
                li.appendChild(_li);
            }
            $('#sidebar ul').html(li);

            $('span.J-current-name').html(user);
        });

    }
});