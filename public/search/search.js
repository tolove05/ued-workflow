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
    new Calendar({
        trigger: '#start-time'
    });

});
