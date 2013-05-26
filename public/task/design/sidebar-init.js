/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:14
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    function getTaskList(user, filter) {
        $.getJSON('/task-of-design/list/' + user, function (res) {

            var li = document.createDocumentFragment();

            for (var i = 0; i < res.data.length; i++) {
                var item = res.data[i];
                var _li = document.createElement('li');
                if (i == 0) $(_li).addClass('checked')
                _li.innerHTML = item.name;
                _li.setAttribute('data-json', JSON.stringify(item));
                li.appendChild(_li);
            }

            $('#sidebar ul').html(li);

            $('#sidebar li.checked').trigger('mousedown')

            $('#sidebar').on('click', 'li', function (ev) {
                $(this).addClass('checked').siblings().removeClass('checked')
            })

        });
    }

    exports.getTaskList = getTaskList;


});