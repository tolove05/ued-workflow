/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-6
 * Time: 上午11:39
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var tpl = require('./login.tpl');
    var template = require('template/template/1.0.0/template-debug');

    function login(cb) {
        KISSY.use("overlay", function (S, O) {
            var dialog = new O.Dialog({
                width: 400,
                headerContent: '登陆',
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

    $(document).on('click', '.login', function () {
        show();
    });

    $(document).on('click', 'input.J-login', function () {
        var form = this.form;
        var name = form.elements.name.value;
        var sha = require('sha');
        var pwd = sha.hex_sha512(form.elements.pwd.value);
        $.ajax({
            type: 'POST',
            url: '/login',
            data: {
                name: name,
                pwd: pwd
            },
            dataType: 'json',
            success: function (data) {
                if (data._id) {
                    exports.dialog.hide();
                    loginSuccess(data);
                } else {
                    alert('请重新登陆')
                }
            }
        })
    });


    function loginSuccess(data) {

        var loginSuccessTpl = require('./login-success.tpl');

        $('#control').html(template(loginSuccessTpl, data));

    }

    function loginFail() {
        var loginSuccessTpl = require('./login-fail.tpl');
        $('#control').html(template(loginSuccessTpl, {}));
    }

    function isLogin() {
        $.getJSON('/check-login', function (data) {
            if (data._id) {
                loginSuccess(data);
            } else {
                loginFail();
            }
        });
    }

    isLogin();

    function loginOut() {

    }

    $(document).on('click', '.login-out', function () {
        $.get('/login-out', function (data) {
            loginFail();
        });
    });

});
