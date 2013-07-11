/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-7-10
 * Time: 下午5:52
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var Calendar = require('calendar');
    require('calendarCSS');

    var template = require('template/template/1.0.0/template-debug');
    var tpl = require('/task/design/show-task-list.tpl');

    new Calendar({
        trigger: '#start-time'
    }).on('selectDate', function (date) {
            $('#start-time span').text(date.format('YYYY-MM-DD'));
            this.hide();
        });

    new Calendar({
        trigger: '#end-time'
    }).on('selectDate', function (date) {
            $('#end-time span').text(date.format('YYYY-MM-DD'));
            this.hide();
        });

    var form = document.forms['search']
    var $form = $(form);
    $form.on('submit', function (ev) {

        ev.preventDefault();
        var data = {
            keywords: form.elements['keyword'].value.trim(),
            type: $('#taks-type-container').find('span.type').text()
        };

        if ($('#start-time').val())  data['start'] = $('#start-time').val().trim();
        if ($('#start-time').val())  data['end'] = $('#start-time').val().trim();

        window.location.hash = '#search/' + JSON.stringify(data);

    });

    $('#task-type').dropdown();

    $('#taks-type-container').on('click', 'a', function (ev) {
        var originTarget = ev.originalEvent.currentTarget;
        $(originTarget).find('span.type').text($(ev.target).text())
    });


    /*开始搜索*/
    var urlRule = /^#search\//;


    function search() {
        try {
            var param = JSON.parse(window.location.hash.replace(urlRule, ''));
        } catch (e) {
            return;
        }

        if (!param.keywords) delete param.keywords;

        $.get('/search', param, function (result) {
            console.log(result);
            $('#task-list').html(template(tpl, result));
        })

    }


    $(window).on('hashchange', function () {
            if (urlRule.test(window.location.hash))   search();
        }
    );

    if (urlRule.test(window.location.hash))  search();

});
