/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-6
 * Time: 下午1:35
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {

    require('./add-multiple-task.css');

    var tpl = require('./add-multiple-task.tpl');

    var template = require('template/template/1.0.0/template-debug');

    //存放第一步的Excel的数据
    var textareaValue = '';

    //缓存准备好了的数据
    var excelData = [];

    //缓存第二步时所选择的字段（也可能未选）
    var step2HTML = '';

    //缓存准备提交的数据
    var postExcelData;

    //存放必备的字段名称
    var fieldsArray = ['设计师', '任务名', '需求方', '任务时长', '任务类型'];

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

    //添加多个任务单的触点
    $(document).on('click', '.J-add-multiple-task-of-design-trigger', function () {
        show();
        if (exports.dialog) {
            exports.dialog.set('bodyContent', template(tpl, {step: 1}))
            exports.dialog.center();
        }
    });

    //添加多个任务时，每一步的触点
    $(document).on('click', '.J-add-multiple-task', function (ev) {
            var $target = $(ev.currentTarget);
            var form = ev.target.form;

            //进入第二步
            if ($target.attr('data-step') === '2' && $target.hasClass('J-next')) {
                textareaValue = form.elements['excel-data'].value;
                transExcelData(textareaValue);
            }

            //从第二步返回到第一步
            if ($target.attr('data-step') === '1' && $target.hasClass('J-go-back')) {
                exports.dialog.set('bodyContent', template(tpl, {step: 1, textareaValue: textareaValue}));
                exports.dialog.center();
            }

            //进入第三步
            if ($target.attr('data-step') === '3' && $target.hasClass('J-preview')) {
                //基础判断，判断字段是否已经全部选中
                var $alreadyTh = $('th.J-menu.already');
                if ($alreadyTh.length === fieldsArray.length) {
                    var cell = (function () {
                        var arr = {};
                        $alreadyTh.each(function (index, item) {
                            var $item = $(item);
                            arr[$item.find('div.fields-name').text()] = $(item).data('cell');
                        });
                        return arr;
                    })();


                    postExcelData = new Array(excelData.length);
                    excelData.forEach(function (item, i) {
                        fieldsArray.forEach(function (fields, j) {
                            if (!postExcelData[i]) {
                                postExcelData[i] = [];
                            }
                            postExcelData[i].push(excelData[i][cell[fields]]);
                        })
                    });

                    step2HTML = exports.dialog.get('contentEl').one('div.ks-stdmod-body').html();
                    exports.dialog.set('bodyContent', template(tpl, {step: 3, data: postExcelData, cell: cell, fieldsArray: fieldsArray}));
                    exports.dialog.center();

                } else {
                    alert('请先选择好所有的字段')
                }
            }

            //从第三步回到第二步
            if ($target.attr('data-step') === '2' && $target.hasClass('J-go-back')) {
                exports.dialog.set('bodyContent', step2HTML);
                exports.dialog.center();
            }

            //最后一步保存数据
            if ($target.attr('data-step') === '4' && $target.hasClass('J-save')) {
                //避免重复提交
                if ($target.data('sending') === true)  return;
                $target.data('sending', true);
                $.ajax({
                    url: '/add-task-design',
                    type: 'post',
                    cache: false,
                    dataType: 'json',
                    data: {
                        company: this.form.elements['company'].value,
                        json: JSON.stringify({data: postExcelData})
                    },
                    success: function (serverInfo) {
                        $target.data('sending', true);
                        exports.dialog.set('bodyContent', template(tpl, {step: 4, serverInfo: serverInfo}));
                        exports.dialog.center();
                    }
                })
            }
        }
    );

    //第二步
    function transExcelData(value) {
        var reg = /[\n\t]"[^\t]*(\n+)[^\t]*"[\n\t]/g;
        value = value.replace(reg, function (re) {
            return re.replace(/["\n]/g, '');
        });
        value = value.replace(/\r/g, '');
        value = value.replace(/'/g, '’');
        var rowDataList = value.split('\n');
        excelData = [];
        for (var i = 0; i < rowDataList.length; i++) {
            var row = rowDataList[i];
            if ($.trim(row).length < 1) continue;
            excelData.push(rowDataList[i].split('\t'));
        }

        excelData = filterEmptyCell(excelData);

        if (!excelData) return;

        exports.dialog.set('bodyContent', template(tpl, {data: excelData, step: 2, sumLength: excelData.length}))
        exports.dialog.center();
    }

    //过滤掉完全空的列
    function filterEmptyCell(data) {
        //获取最大列数
        if (data.length < 1) return;
        for (var i = 0; i < data[0].length; i++) {
            if (checkIsEmptyString(i) === true) {
                for (var j = 0; j < data.length; j++)   data[j].splice(i, 1);
                i -= 1;
            }
        }

        function checkIsEmptyString(j) {
            var num = 0;
            for (var i = 0; i < data.length; i++)  if (data[i][j] === '') {
                num++;
            }
            return num === data.length;
        }

        return data;
    }


    //让组长或主管可以选择该字段所对应的所有任务单
    $(document).on('mouseenter mouseleave', 'th.J-menu', function (ev) {
        var $target = $(ev.currentTarget);
        if (ev.type === 'mouseenter') {
            $(this).find('div.wrapper').append($('<div class="menu"><div class="cancel">取消</div>' + (function () {

                var th = $target.siblings('th').add($target);

                var html = '';
                var leftArray = [];
                th.each(function (index, item) {
                    var fieldsName = $(item).find('div.fields-name');
                    if (fieldsName.text() !== '请选择') {
                        if (fieldsArray.indexOf($.trim(fieldsName.text())) > -1) leftArray.push(fieldsName.text())
                    }
                });
                for (var i = 0; i < fieldsArray.length; i++) {
                    if (leftArray.indexOf(fieldsArray[i]) > -1) continue;
                    html += '<div>' + fieldsArray[i] + '</div>'
                }
                return html;

            })() + '</div>'))
        } else {
            $(this).find('div.menu').remove();
        }
    });

    $(document).on('click', 'th.J-menu .menu div', function (ev) {

        var $this = $(this);
        var $th = $(this).parents('th');

        if (!$this.hasClass('cancel')) {
            $th.find('div.fields-name').html($this.html());
            $th.addClass('already');
        } else {
            $th.find('div.fields-name').html('请选择');
            $th.removeClass('already');
        }
        $th.find('div.menu').remove();

    });

});
