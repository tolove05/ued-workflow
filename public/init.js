/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-22
 * Time: 下午5:09
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {


    if (window["page_is_login"] === true) {
        require.async('/user/init');
        //设计师
        require.async('/task/design/init');
    }

    require('/login/init');

});
