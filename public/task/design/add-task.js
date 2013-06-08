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

            var dialog = new O.Dialog({
                width: 400,
                headerContent: '添加单个设计师任务',
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
            add_task(function () {
                exports.dialog.show();
                exports.dialog.center();
            })
        }
    }

    $(window).on('resize', function () {
        if (exports.dialog && exports.dialog.get("visible")) exports.dialog.center();
    });

    $(document).on('click', '.J-add-single-task-of-design-trigger', function () {
        show();
    })


    $(document).on('click', 'input.J-add-task', function () {
        var form = this.form;
        $.post("/add-task", $(form).serialize());
    });

});
