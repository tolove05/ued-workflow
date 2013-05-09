/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-6
 * Time: 下午1:35
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    var tpl = require('./add-multiple-task.tpl');
    var template = require('template/template/1.0.0/template-debug');

    function add_task(cb) {
        KISSY.use("overlay", function (S, O) {

            var dialog = new O.Dialog({
                headerContent: '批量添加任务',
                bodyContent: template(tpl, {step: 1}),
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

    $(document).on('click', '.add-multiple-task', function () {
        show();
    })


    $(document).on('click', '.J-add-multiple-task', function (ev) {
        var $target = $(ev.currentTarget);
        var form = ev.target.form;

        if ($target.attr('data-step') === '1') {
            var textarea = form.elements['excel-data'].value;
            transExcelData(textarea);
        } else {

        }
    });

    function transExcelData(value) {
        var table = [];
        var line = value.split(/[\r\n]/gm);

        for (var i = 0; i < line.length; i++) {
            var obj = line[i];
            console.log(obj.split(/\t+/)[3]);
        }

    }

});
