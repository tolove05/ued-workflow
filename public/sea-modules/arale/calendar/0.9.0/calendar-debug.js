define("arale/calendar/0.9.0/calendar-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "./base-calendar-debug", "arale/position/1.0.1/position-debug", "arale/widget/1.1.0/widget-debug", "arale/base/1.1.0/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./i18n/{locale}-debug", "./date-column-debug", "./base-column-debug", "./month-column-debug", "./year-column-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var BaseCalendar = require("./base-calendar-debug");
    var DateColumn = require("./date-column-debug");
    var MonthColumn = require("./month-column-debug");
    var YearColumn = require("./year-column-debug");
    var template = [ '<div class="ui-calendar">', '<div class="ui-calendar-pannel" data-role="pannel">', '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>', '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>', '<span class="ui-calendar-control month" data-role="current-month"></span>', '<span class="ui-calendar-control year" data-role="current-year"></span>', '<span class="ui-calendar-control" data-role="next-month">&gt;</span>', '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>', "</div>", '<div class="ui-calendar-container" data-role="container">', "</div>", "</div>" ].join("");
    var Calendar = BaseCalendar.extend({
        attrs: {
            mode: "dates",
            template: template
        },
        events: {
            "click [data-role=current-month]": function(ev) {
                if (this.get("mode") === "months") {
                    this.renderContainer("dates");
                } else {
                    this.renderContainer("months");
                }
            },
            "click [data-role=current-year]": function(ev) {
                if (this.get("mode") === "years") {
                    this.renderContainer("dates");
                } else {
                    this.renderContainer("years");
                }
            },
            "click [data-role=prev-year]": function(ev) {
                var focus = this.years.prev();
                this.dates.select(focus);
                this.months.select(focus);
            },
            "click [data-role=next-year]": function(ev) {
                var focus = this.years.next();
                this.dates.select(focus);
                this.months.select(focus);
            },
            "click [data-role=prev-month]": function(ev) {
                var focus = this.months.prev();
                this.dates.select(focus);
                this.years.select(focus);
            },
            "click [data-role=next-month]": function(ev) {
                var focus = this.months.next();
                this.dates.select(focus);
                this.years.select(focus);
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            this.renderPannel();
            var attrs = {
                lang: this.get("lang"),
                focus: this.get("focus"),
                range: this.get("range"),
                format: this.get("format"),
                startDay: this.get("startDay"),
                process: this.get("process")
            };
            this.dates = new DateColumn(attrs);
            this.months = new MonthColumn(attrs);
            this.years = new YearColumn(attrs);
            var self = this;
            this.dates.on("select", function(value, el) {
                self.set("focus", value);
                var focus = self.get("focus");
                self.months.select(focus);
                self.years.select(focus);
                self.trigger("selectDate", value);
                if (el) {
                    if (moment.isMoment(value)) {
                        value = value.format(this.get("format"));
                    }
                    self._output(value);
                }
            });
            this.months.on("select", function(value, el) {
                var focus = self.get("focus");
                focus.month(value);
                self.set("focus", focus);
                self.renderPannel();
                if (el) {
                    self.renderContainer("dates", focus);
                }
                self.trigger("selectMonth", focus);
            });
            this.years.on("select", function(value, el) {
                var focus = self.get("focus");
                focus.year(value);
                self.set("focus", focus);
                self.renderPannel();
                if (el && el.data("role") === "year") {
                    self.renderContainer("dates", focus);
                }
                self.trigger("selectYear", focus);
            });
            var container = this.element.find("[data-role=container]");
            container.append(this.dates.element);
            container.append(this.months.element);
            container.append(this.years.element);
            this.renderContainer("dates");
        },
        renderContainer: function(mode, focus) {
            this.set("mode", mode);
            focus = focus || this.get("focus");
            this.dates.hide();
            this.months.hide();
            this.years.hide();
            this.dates.select(focus, null);
            this.months.select(focus, null);
            this.years.select(focus, null);
            if (mode === "dates") {
                this.dates.element.show();
            } else if (mode === "months") {
                this.months.element.show();
            } else if (mode === "years") {
                this.years.element.show();
            }
            return this;
        },
        renderPannel: function() {
            var focus = this.get("focus");
            var monthPannel = this.element.find("[data-role=current-month]");
            var yearPannel = this.element.find("[data-role=current-year]");
            var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            var month = MONTHS[focus.month()];
            month = this.get("lang")[month] || month;
            monthPannel.text(month);
            yearPannel.text(focus.year());
        },
        destroy: function() {
            this.dates.destroy();
            this.months.destroy();
            this.years.destroy();
            Calendar.superclass.destroy.call(this);
        }
    });
    Calendar.BaseColumn = require("./base-column-debug");
    Calendar.BaseCalendar = BaseCalendar;
    Calendar.DateColumn = DateColumn;
    Calendar.MonthColumn = MonthColumn;
    Calendar.YearColumn = YearColumn;
    module.exports = Calendar;
});

define("arale/calendar/0.9.0/base-calendar-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.0/widget-debug", "arale/base/1.1.0/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/calendar/0.9.0/i18n/{locale}-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Position = require("arale/position/1.0.1/position-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var Widget = require("arale/widget/1.1.0/widget-debug");
    var lang = require("arale/calendar/0.9.0/i18n/{locale}-debug") || {};
    var ua = (window.navigator.userAgent || "").toLowerCase();
    var match = ua.match(/msie\s+(\d+)/);
    var insaneIE = false;
    if (match && match[1]) {
        insaneIE = parseInt(match[1], 10) < 9;
    }
    var BaseCalendar = Widget.extend({
        attrs: {
            lang: lang,
            trigger: null,
            triggerType: "click",
            output: {
                value: "",
                getter: function(val) {
                    val = val ? val : this.get("trigger");
                    return $(val);
                }
            },
            hideOnSelect: true,
            focus: {
                value: "",
                getter: function(val) {
                    val = val ? val : $(this.get("trigger")).val();
                    if (!val) {
                        return moment();
                    }
                    return moment(val, this.get("format"));
                },
                setter: function(val) {
                    if (!val) {
                        return moment();
                    }
                    return moment(val, this.get("format"));
                }
            },
            format: "YYYY-MM-DD",
            startDay: "Sun",
            range: {
                value: null,
                setter: function(val) {
                    if ($.isArray(val)) {
                        var format = this.get("format");
                        var range = [];
                        $.each(val, function(i, date) {
                            date = date === null ? null : moment(date, format);
                            range.push(date);
                        });
                        return range;
                    }
                    return val;
                }
            },
            process: null,
            align: {
                getter: function(val) {
                    if (val) return val;
                    var trigger = $(this.get("trigger"));
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 0, trigger.height() + 10 ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            }
        },
        setup: function() {
            BaseCalendar.superclass.setup.call(this);
            this.enable();
            var self = this;
            this.element.on("mousedown", function(e) {
                if (insaneIE) {
                    var trigger = $(self.get("trigger"))[0];
                    trigger.onbeforedeactivate = function() {
                        window.event.returnValue = false;
                        trigger.onbeforedeactivate = null;
                    };
                }
                e.preventDefault();
            });
        },
        show: function() {
            if (!this.rendered) {
                this._pin();
                this.render();
            }
            this._pin();
            this.element.show();
        },
        hide: function() {
            this.element.hide();
        },
        _pin: function(align) {
            align = align || this.get("align");
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
        },
        _output: function(value) {
            var output = this.get("output");
            if (!output.length) {
                return;
            }
            if (typeof output[0].value) {
                output.val(value);
            }
            if (this.get("hideOnSelect")) {
                this.hide();
            }
        },
        enable: function() {
            var trigger = this.get("trigger");
            if (!trigger) {
                return;
            }
            var self = this;
            var $trigger = $(trigger);
            if ($trigger.attr("type") === "date") {
                // remove default style for type date
                $trigger.attr("type", "text");
            }
            var event = this.get("triggerType") + ".calendar";
            $trigger.on(event, function() {
                self.show();
            });
            $trigger.on("blur.calendar", function() {
                self.hide();
            });
        },
        disable: function() {
            var trigger = this.get("trigger");
            var self = this;
            if (trigger) {
                var $trigger = $(trigger);
                var event = this.get("triggerType") + ".calendar";
                $trigger.off(event);
                $trigger.off("blur.calendar");
            }
        }
    });
    module.exports = BaseCalendar;
});

define("arale/calendar/0.9.0/date-column-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "arale/calendar/0.9.0/base-column-debug", "arale/widget/1.1.0/widget-debug", "arale/base/1.1.0/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var BaseColumn = require("arale/calendar/0.9.0/base-column-debug");
    var DateColumn = BaseColumn.extend({
        attrs: {
            startDay: "Sun",
            template: template,
            range: {
                value: null,
                setter: function(val) {
                    if ($.isArray(val)) {
                        var format = this.get("format");
                        var range = [];
                        $.each(val, function(i, date) {
                            date = date === null ? null : moment(date, format);
                            range.push(date);
                        });
                        return range;
                    }
                    return val;
                }
            },
            process: null,
            model: {
                getter: function() {
                    var date = createDateModel(this.get("focus"), this.get("startDay"), this.get("range"), this.get("process"));
                    var day = createDayModel(this.get("startDay"));
                    return {
                        date: date,
                        day: day
                    };
                }
            }
        },
        events: {
            "click [data-role=date]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        prev: function() {
            var prev = this.get("focus").format("YYYY-MM-DD");
            var focus = this.get("focus").add("days", -1);
            return this._sync(focus, prev);
        },
        next: function() {
            var prev = this.get("focus").format("YYYY-MM-DD");
            var focus = this.get("focus").add("days", 1);
            return this._sync(focus, prev);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var prev = this.get("focus").format("YYYY-MM-DD");
            this.set("focus", value);
            return this._sync(this.get("focus"), prev, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.format("YYYY-MM-DD") + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        _sync: function(focus, prev, el) {
            this.set("focus", focus);
            if (focus.format("YYYY-MM") !== prev) {
                this.refresh();
            }
            this.focus(focus);
            // if user call select(value, null) it will not trigger an event
            if (el !== null) {
                this.trigger("select", focus, el);
            }
            return focus;
        }
    });
    module.exports = DateColumn;
    // helpers
    var DAYS = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ];
    function parseStartDay(startDay) {
        startDay = (startDay || 0).toString().toLowerCase();
        if ($.isNumeric(startDay)) {
            startDay = parseInt(startDay, 10);
            return startDay;
        }
        for (var i = 0; i < DAYS.length; i++) {
            if (DAYS[i].indexOf(startDay) === 0) {
                startDay = i;
                break;
            }
        }
        return startDay;
    }
    var DAY_LABELS = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];
    function createDayModel(startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        startDay = parseStartDay(startDay);
        var items = [];
        for (var i = startDay; i < 7; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        for (i = 0; i < startDay; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        var current = {
            value: startDay,
            label: DAY_LABELS[startDay]
        };
        return {
            current: current,
            items: items
        };
    }
    function createDateModel(current, startDay, range, fn) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);
        var pushData = function(d, className) {
            var item = {
                value: d.format("YYYY-MM-DD"),
                label: d.date(),
                day: d.day(),
                className: className,
                available: BaseColumn.isInRange(d, range)
            };
            if (fn) {
                item.type = "date";
                item = fn(item);
            }
            items.push(item);
        };
        // reset to the first date of the month
        var currentMonth = current.clone().date(1);
        var previousMonth = currentMonth.clone().add("months", -1);
        var nextMonth = currentMonth.clone().add("months", 1);
        // Calculate days of previous month
        // that should be on current month's sheet
        delta = currentMonth.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previousMonth.daysInMonth();
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previousMonth.date(daysInMonth - i);
                pushData(d, "previous-month");
            }
        }
        daysInMonth = currentMonth.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = currentMonth.date(i);
            pushData(d, "current-month");
        }
        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = nextMonth.date(i);
                pushData(d, "next-month");
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }
        var _current = {
            value: current.format("YYYY-MM-DD"),
            label: current.date()
        };
        return {
            current: _current,
            items: list
        };
    }
    /* template in handlebars
  <table class="ui-calendar-date" data-role="date-column">
    <tr class="ui-calendar-day-column">
      {{#each day.items}}
      <th class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</th>
      {{/each}}
    </tr>
    {{#each date.items}}
    <tr class="ui-calendar-date-column">
      {{#each this}}
      <td class="ui-calendar-day-{{day}} {{className}} {{#unless available}}disabled-element{{/unless}}" data-role="date" data-value="{{value}}">{{label}}</td>
      {{/each}}
    </tr>
    {{/each}}
  </table>
  */
    function template(model, options) {
        // keep the same API as handlebars
        var _ = options.helpers._;
        var html = '<table class="ui-calendar-date" data-role="date-column">';
        // day column
        html += '<tr class="ui-calendar-day-column">';
        $.each(model.day.items, function(i, item) {
            html += '<th class="ui-calendar-day ui-calendar-day-' + item.value + '" ';
            html += 'data-role="day" data-value="' + item.value + '">';
            html += _(item.label);
            html += "</th>";
        });
        html += "</tr>";
        // date column
        $.each(model.date.items, function(i, items) {
            html += '<tr class="ui-calendar-date-column">';
            $.each(items, function(i, item) {
                var className = [ "ui-calendar-day-" + item.day, item.className || "" ];
                if (!item.available) {
                    className.push("disabled-element");
                }
                html += '<td class="' + className.join(" ") + '" data-role="date"';
                html += 'data-value="' + item.value + '">';
                html += item.label + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("arale/calendar/0.9.0/base-column-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.0/widget-debug", "arale/base/1.1.0/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var Widget = require("arale/widget/1.1.0/widget-debug");
    var BaseColumn = Widget.extend({
        attrs: {
            focus: {
                value: "",
                getter: function(val) {
                    if (val) {
                        return val;
                    }
                    return moment();
                },
                setter: function(val) {
                    if (!val) {
                        return moment();
                    }
                    if (moment.isMoment(val)) {
                        return val;
                    }
                    return moment(val, this.get("format"));
                }
            },
            template: null,
            format: "YYYY-MM-DD",
            lang: {}
        },
        compileTemplate: function() {
            // the template is a runtime handlebars function
            var fn = this.get("template");
            if (!fn) {
                return "";
            }
            var model = this.get("model");
            var self = this;
            var lang = this.get("lang") || {};
            return fn(model, {
                helpers: {
                    _: function(key) {
                        return lang[key] || key;
                    }
                }
            });
        },
        parseElement: function() {
            // rewrite parseElement of widget
            this.element = $(this.compileTemplate());
        },
        show: function() {
            this.render();
            this.focus();
        },
        hide: function() {
            this.element.hide();
        },
        refresh: function() {
            this.element.html($(this.compileTemplate()).html());
        }
    });
    module.exports = BaseColumn;
    BaseColumn.isInRange = function(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        if ($.isFunction(range)) {
            return range(date);
        }
        return true;
    };
});

define("arale/calendar/0.9.0/month-column-debug", [ "$-debug", "arale/calendar/0.9.0/base-column-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.0/widget-debug", "arale/base/1.1.0/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var BaseColumn = require("arale/calendar/0.9.0/base-column-debug");
    var MonthColumn = BaseColumn.extend({
        attrs: {
            template: template,
            range: null,
            process: null,
            model: {
                getter: function() {
                    return createMonthModel(this.get("focus"), this.get("range"), this.get("process"));
                }
            }
        },
        events: {
            "click [data-role=month]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        prev: function() {
            var focus = this.get("focus").add("months", -1);
            return this._sync(focus);
        },
        next: function() {
            var focus = this.get("focus").add("months", 1);
            return this._sync(focus);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var focus;
            if (value.month) {
                focus = value;
            } else {
                focus = this.get("focus").month(value);
            }
            return this._sync(focus, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.month() + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.focus(focus);
            // if user call select(value, null) it will not trigger an event
            if (el !== null) {
                this.trigger("select", focus.month(), el);
            }
            return focus;
        }
    });
    module.exports = MonthColumn;
    // helpers
    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    function createMonthModel(time, range, fn) {
        var month = time.month();
        var items = [];
        for (i = 0; i < MONTHS.length; i++) {
            var item = {
                value: i,
                available: isInRange(i, range),
                label: MONTHS[i]
            };
            if (fn) {
                item.type = "month";
                item = fn(item);
            }
            items.push(item);
        }
        var current = {
            value: month,
            label: MONTHS[month]
        };
        // split [1, 2, .. 12] to [[1, 2, 3, 4], [5, ...]...]
        var list = [];
        for (var i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        return {
            current: current,
            items: list
        };
    }
    function isInRange(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            if (start && start.month) {
                start = start.month();
            }
            var end = range[1];
            if (end && end.month) {
                end = end.month();
            }
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        return true;
    }
    /* template in handlebars
  <table class="ui-calendar-month" data-role="month-column">
  {{#each items}}
  <tr class="ui-calendar-month-column">
      {{#each this}}
      <td class="{{#unless available}}disabled-element{{/unless}}" data-role="month" data-value="{{value}}">{{_ label}}</td>
      {{/each}}
  </tr>
  {{/each}}
  </table>
  */
    function template(model, options) {
        var _ = options.helpers._;
        html = '<table class="ui-calendar-month" data-role="month-column">';
        $.each(model.items, function(i, items) {
            html += '<tr class="ui-calendar-month-column">';
            $.each(items, function(i, item) {
                html += '<td data-role="month"';
                if (!item.available) {
                    html += ' class="disabled-element"';
                }
                html += 'data-value="' + item.value + '">';
                html += _(item.label) + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});

define("arale/calendar/0.9.0/year-column-debug", [ "$-debug", "arale/calendar/0.9.0/base-column-debug", "gallery/moment/2.0.0/moment-debug", "arale/widget/1.1.0/widget-debug", "arale/base/1.1.0/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var BaseColumn = require("arale/calendar/0.9.0/base-column-debug");
    var YearColumn = BaseColumn.extend({
        attrs: {
            range: null,
            process: null,
            template: template,
            model: {
                getter: function() {
                    return createYearModel(this.get("focus"), this.get("range"), this.get("process"));
                }
            }
        },
        events: {
            "click [data-role=year],[data-role=previous-10-year],[data-role=next-10-year]": function(ev) {
                var el = $(ev.target);
                var value = el.data("value");
                this.select(value, el);
            }
        },
        prev: function() {
            var focus = this.get("focus").add("years", -1);
            return this._sync(focus);
        },
        next: function() {
            var focus = this.get("focus").add("years", 1);
            return this._sync(focus);
        },
        select: function(value, el) {
            if (el && el.hasClass("disabled-element")) {
                this.trigger("selectDisable", value, el);
                return value;
            }
            var focus;
            if (value.year) {
                focus = value;
            } else {
                focus = this.get("focus").year(value);
            }
            return this._sync(focus, el);
        },
        focus: function(focus) {
            focus = focus || this.get("focus");
            var selector = "[data-value=" + focus.year() + "]";
            this.element.find(".focused-element").removeClass("focused-element");
            this.element.find(selector).addClass("focused-element");
        },
        refresh: function() {
            var focus = this.get("focus").year();
            var years = this.element.find("[data-role=year]");
            if (focus < years.first().data("value") || focus > years.last().data("value")) {
                this.element.html($(this.compileTemplate()).html());
            }
        },
        _sync: function(focus, el) {
            this.set("focus", focus);
            this.refresh();
            this.focus(focus);
            if (el !== null) {
                this.trigger("select", focus.year(), el);
            }
            return focus;
        }
    });
    module.exports = YearColumn;
    // helpers
    function createYearModel(time, range, fn) {
        var year = time.year();
        var items = [ process({
            value: year - 10,
            label: ". . .",
            available: true,
            role: "previous-10-year"
        }, fn) ];
        for (var i = year - 6; i < year + 4; i++) {
            items.push(process({
                value: i,
                label: i,
                available: isInRange(i, range),
                role: "year"
            }, fn));
        }
        items.push(process({
            value: year + 10,
            label: ". . .",
            available: true,
            role: "next-10-year"
        }, fn));
        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        var current = {
            value: year,
            label: year
        };
        return {
            current: current,
            items: list
        };
    }
    function process(item, fn) {
        if (!fn) {
            return item;
        }
        item.type = "year";
        return fn(item);
    }
    function isInRange(date, range) {
        if (range == null) {
            return true;
        }
        if ($.isArray(range)) {
            var start = range[0];
            if (start && start.year) {
                start = start.year();
            }
            var end = range[1];
            if (end && end.year) {
                end = end.year();
            }
            var result = true;
            if (start) {
                result = result && date >= start;
            }
            if (end) {
                result = result && date <= end;
            }
            return result;
        }
        return true;
    }
    /* template in handlebars
  <table class="ui-calendar-year" data-role="year-column">
    {{#each items}}
    <tr class="ui-calendar-year-column">
      {{#each this}}
      <td {{#unless available}}class="disabled-element"{{/unless}} data-role="{{role}}" data-value="{{value}}">{{_ label}}</td>
      {{/each}}
    </tr>
    {{/each}}
  </table>
  */
    function template(model, options) {
        var _ = options.helpers._;
        html = '<table class="ui-calendar-year" data-role="year-column">';
        $.each(model.items, function(i, items) {
            html += '<tr class="ui-calendar-year-column">';
            $.each(items, function(i, item) {
                html += '<td data-role="' + item.role + '"';
                if (!item.available) {
                    html += ' class="disabled-element"';
                }
                html += 'data-value="' + item.value + '">';
                html += _(item.label) + "</td>";
            });
            html += "</tr>";
        });
        html += "</table>";
        return html;
    }
});
