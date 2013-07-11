/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-7-9
 * Time: 下午5:10
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var moment = require('gallery/moment/2.0.0/moment');

    moment.lang('zh-cn', {
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
        weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
        weekdaysMin: "日_一_二_三_四_五_六".split("_"),
        longDateFormat: {
            LT: "Ah点mm",
            L: "YYYY年MMMD日",
            LL: "YYYY年MMMD日",
            LLL: "YYYY年MMMD日LT",
            LLLL: "YYYY年MMMD日ddddLT",
            l: "YYYY年MMMD日",
            ll: "YYYY年MMMD日",
            lll: "YYYY年MMMD日LT",
            llll: "YYYY年MMMD日ddddLT"
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 9) {
                return "早上";
            } else if (hour < 11 && minute < 30) {
                return "上午";
            } else if (hour < 13 && minute < 30) {
                return "中午";
            } else if (hour < 18) {
                return "下午";
            } else {
                return "晚上";
            }
        },
        calendar: {
            sameDay: '[今天]LT',
            nextDay: '[明天]LT',
            nextWeek: '[下]ddddLT',
            lastDay: '[昨天]LT',
            lastWeek: '[上]ddddLT',
            sameElse: 'L'
        },
        ordinal: function (number, period) {
            switch (period) {
                case "d" :
                case "D" :
                case "DDD" :
                    return number + "日";
                case "M" :
                    return number + "月";
                case "w" :
                case "W" :
                    return number + "周";
                default :
                    return number;
            }
        },
        relativeTime: {
            future: "%s内",
            past: "%s前",
            s: "几秒",
            m: "1分钟",
            mm: "%d分钟",
            h: "1小时",
            hh: "%d小时",
            d: "1天",
            dd: "%d天",
            M: "1个月",
            MM: "%d个月",
            y: "1年",
            yy: "%d年"
        }
    });


    var cl = setTimeout(update, 1000);


    $('body').on('DOMSubtreeModified', function (ev) {
        clearTimeout(cl);
        cl = setTimeout(update, 1000);
    });

    var i = 0;

    function update() {
        $('span.J-moment').each(function (i, item) {
            $(item).html(moment($(item).data('time-stamp')).calendar())
        });
        cl = setTimeout(update, 1000);
        if (document.visible) {
            // 页面可见时的正常逻辑
        } else {
            // 页面不可见时，减少点资源占用
        }
    }



});



