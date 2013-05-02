/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午4:14
 * To change this template use File | Settings | File Templates.
 */

define(function (exports, require, module) {


    $.getJSON('task/list', function (res) {
        var li = document.createDocumentFragment();

        for (var i = 0; i < res.data.length; i++) {
            var item = res.data[i];
            var _li = document.createElement('li');
            _li.innerHTML = item.name;
            _li.setAttribute('data-json', JSON.stringify(item));
            li.appendChild(_li);
        }
        $('#sidebar ul').append(li);
    })

});