/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-6
 * Time: 下午1:35
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var tpl = require('./add-task.tpl');

    function add_task(cb) {
        KISSY.use("overlay", function (S, O) {
            var template = require('template/template/1.0.0/template-debug');

            var dialog = new O.Dialog({
                width: 400,
                headerContent: '添加新任务',
                bodyContent: template(tpl, {user: require('/user/list?callback=define')}),
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
            add_task(function () {
                exports.dialog.show();
            })
        }
    }

    $(document).on('click', '.add-task', function () {
        show();
    })


    $(document).on('click', 'input.J-add-task', function () {
        var form = this.form;
        $.post("/add-task", $(form).serialize());
    });

});
