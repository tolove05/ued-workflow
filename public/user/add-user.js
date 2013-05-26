/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-7
 * Time: 下午5:10
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var tpl = require('./add-user.tpl');

    require('./add-user.css');

    function login(cb) {
        KISSY.use("overlay", function (S, O) {
            var dialog = new O.Dialog({
                width: 400,
                headerContent: '添加用户',
                bodyContent: tpl,
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

    $(document).on('click', '.add-user', function () {
        show();
    });

    $(document).on('click', '.J-add-user-control', function () {
        show();
    });

    $(document).on('click', '.J-add-user', function () {
        var form = this.form;
        var name = form.elements.name.value;
        var sha = require('sha');
        var group = form.elements.group.value;
        var pwd = sha.hex_sha512(form.elements.pwd.value);
        $.post('/add-user', {
            name: name,
            pwd: pwd,
            group: group
        })
    });

});
