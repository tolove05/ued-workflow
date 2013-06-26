/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-6-17
 * Time: 下午4:21
 * 添加子成员
 */
define(function (require, exports, module) {

    var tpl = require('./add-child-members.tpl');

    var template = require('template/template/1.0.0/template-debug');

    require('./add-child-members.css');

    var users = require('user/list?callback=define');

    function login(cb) {
        KISSY.use("overlay", function (S, O) {
            var dialog = new O.Dialog({
                width: 400,
                headerContent: '添加你的下属',
                bodyContent: template(tpl, {users: users}),
                mask: true,
                zIndex: 9999,
                align: {
                    // node: '#c1',
                    points: ['cc', 'cc']
                },
                closable: true
            });
            exports.dialog = dialog;
            if (cb) cb();
        });
    }

    function show() {
        if (exports.dialog) {
            exports.dialog.show();
            exports.dialog.center();
        } else {
            login(function () {
                exports.dialog.show();
                exports.dialog.center();
            })
        }
    }

    $(window).on('resize', function () {
        if (exports.dialog && exports.dialog.get("visible")) exports.dialog.center();
    });

    $(document).on('click', '.J-add-child-members', function () {
        show();
    });

    $(document).on('click', '.J-add-child-members-post', function () {
        var form = this.form;
        $.post('/add-child-members', {
            name: form.elements['name'].value
        },function (data) {
            console.log(data)
        }, 'json').error(function () {
                console.log(exports.dialog)
            });
    });

});
