/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-22
 * Time: 下午5:09
 * To change this template use File | Settings | File Templates.
 */


seajs.config({
    base: "/sea-modules/",
    vars: {
        locale: 'zh-cn'
    },
    plugins: ['text'],
    alias: {
        "$": '/jquery-2.0.3.min',
        template: 'template/template/1.0.0/template',
        moment: 'gallery/moment/2.0.0/moment',
        sha: '/crypto/sha',
        calendar: 'arale/calendar/0.9.0/calendar',
        calendarCSS: 'arale/calendar/0.9.0/calendar.css'
    },
    preload: ['$', 'template', 'moment', 'sha', 'calendar']
});


define(function (require, exports, module) {


    if (window["page_is_login"] === true) {
        require.async('/user/init');
        //设计师
        require.async('/task/design/init');

        require.async('/search/search');
    }

    require('/login/init');

    require('./global/moment');


});
