/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-6
 * Time: 上午11:39
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var tpl = require('./login.tpl');

    function login(cb) {
        KISSY.use("overlay", function (S, O) {
            var dialog = new O.Dialog({
                width: 400,
                headerContent: '登陆',
                bodyContent: tpl,
                mask: true,
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
        } else {
            login(function () {
                exports.dialog.show();
            })
        }
    }

    $(document).on('click', '.login', function () {
        show();
    })

    $(document).on('click', 'input.J-login', function () {
        var form = this.form;
        var name = form.elements.name.value;
        var sha = require('sha');
        var pwd = sha.hex_sha512(form.elements.pwd.value);
        $.post('/login', {
            name: name,
            pwd: pwd
        })
    });

});
