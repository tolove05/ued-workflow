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

    require('./login.css');

    function login(cb) {
        KISSY.use("overlay", function (S, O) {
            var dialog = new O.Dialog({
                width: 400,
                headerContent: '登陆',
                //bodyContent: template(tpl, {model: 'login'}),
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

    function show(fn) {
        if (exports.dialog) {
            exports.dialog.show();
            if (fn) fn();
            exports.dialog.center();
        } else {
            login(function () {
                if (fn) fn();
                exports.dialog.show();
                exports.dialog.center();
            })
        }
    }

    $(window).on('resize', function () {
        if (exports.dialog && exports.dialog.get("visible")) exports.dialog.center();
    });

    $(document).on('click', '.J-login-trigger', function () {
        show(function () {
            exports.dialog.set('bodyContent', template(tpl, {model: 'login'}));
        });
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
                    alert('登陆失败')
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
            if (data.status === 1) {
                loginSuccess(data);
            } else {
                loginFail();
            }
        });
    }

    isLogin();

    //退出
    $(document).on('click', '.login-out', function () {
        $.get('/login-out', function (data) {
            loginFail();
        });
    });

    //第一次登陆
    $(document).on('click', '.J-first-login', function () {
        exports.dialog.set('headerContent', '第一次登陆');
        exports.dialog.set('bodyContent', template(tpl, {model: 'first-login'}));
        exports.dialog.center();
    });

    //第一次设置密码
    $(document).on('click', '.J-init-user', function () {
        var form = this.form;
        var data = {
            user: form.elements['user'].value.trim(),
            pwd1: form.elements['pwd1'].value.trim(),
            pwd2: form.elements['pwd2'].value.trim()
        };

        var err = [];
        if (data.user.length < 2) err.push('用户名格式不正确');
        if (data.pwd1.length < 4) err.push('密码不能低于四位');
        if (data.pwd1 !== data.pwd2) err.push('两次密码不匹配');

        if (err.length > 0) {
            alert(err.join('\r\n'));
            return;
        }

        var sha = require('sha');
        data.pwd1 = data.pwd2 = sha.hex_sha512(data.pwd1);

        $.ajax({
            type: 'POST',
            url: '/login/init-user',
            data: data,
            dataType: 'json',
            success: function (data) {

            }
        })

    });

    //返回登陆界面
    $(document).on('click', '.J-back-to-login', function () {
        exports.dialog.set('bodyContent', template(tpl, {model: 'login'}));
        exports.dialog.set('headerContent', '登陆');
        exports.dialog.center();
    });


});
