'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var antd = require('antd');
var icons = require('@ant-design/icons');
var moment = require('moment');
var echarts = require('echarts');
var styled = require('styled-components');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var echarts__namespace = /*#__PURE__*/_interopNamespaceDefault(echarts);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var Chart = function (_a) {
    var data = _a.data, _b = _a.height, height = _b === void 0 ? 400 : _b, _c = _a.loading, loading = _c === void 0 ? false : _c, title = _a.title, _d = _a.showLegend, showLegend = _d === void 0 ? true : _d, _e = _a.showTooltip, showTooltip = _e === void 0 ? true : _e;
    var chartRef = react.useRef(null);
    var chartInstance = react.useRef(null);
    react.useEffect(function () {
        if (!chartRef.current)
            return;
        // 初始化图表
        if (!chartInstance.current) {
            chartInstance.current = echarts__namespace.init(chartRef.current);
        }
        var chart = chartInstance.current;
        // 配置图表选项
        var option = {
            title: title
                ? {
                    text: title,
                    left: 'center',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'normal',
                    },
                }
                : undefined,
            tooltip: showTooltip
                ? {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    },
                    formatter: function (params) {
                        if (!Array.isArray(params))
                            return '';
                        var time = new Date(params[0].axisValue).toLocaleString();
                        var content = "<div style=\"margin-bottom: 4px;\">".concat(time, "</div>");
                        params.forEach(function (param) {
                            var _a;
                            content += "\n              <div style=\"display: flex; align-items: center; margin-bottom: 2px;\">\n                <span style=\"display: inline-block; width: 10px; height: 10px; background-color: ".concat(param.color, "; border-radius: 50%; margin-right: 8px;\"></span>\n                <span style=\"margin-right: 8px;\">").concat(param.seriesName, ":</span>\n                <span style=\"font-weight: bold;\">").concat(((_a = param.value[1]) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || 'N/A', "</span>\n              </div>\n            ");
                        });
                        return content;
                    },
                }
                : undefined,
            legend: showLegend
                ? {
                    type: 'scroll',
                    bottom: 10,
                    data: (data === null || data === void 0 ? void 0 : data.series.map(function (s) { return s.name; })) || [],
                }
                : undefined,
            grid: {
                left: '3%',
                right: '4%',
                bottom: showLegend ? '15%' : '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#d9d9d9',
                    },
                },
                axisLabel: {
                    formatter: function (value) {
                        return new Date(value).toLocaleTimeString();
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#d9d9d9',
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0',
                    },
                },
            },
            series: (data === null || data === void 0 ? void 0 : data.series.map(function (series) { return ({
                name: series.name,
                type: 'line',
                data: series.data,
                smooth: true,
                lineStyle: {
                    color: series.color,
                    width: 2,
                },
                itemStyle: {
                    color: series.color,
                },
                emphasis: {
                    focus: 'series',
                },
            }); })) || [],
        };
        // 设置加载状态
        if (loading) {
            chart.showLoading('default', {
                text: '加载中...',
                color: '#1890ff',
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
        }
        else {
            chart.hideLoading();
            chart.setOption(option, true);
        }
        // 响应式调整
        var handleResize = function () {
            chart.resize();
        };
        window.addEventListener('resize', handleResize);
        return function () {
            window.removeEventListener('resize', handleResize);
        };
    }, [data, loading, title, showLegend, showTooltip]);
    react.useEffect(function () {
        return function () {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, []);
    return (jsxRuntime.jsx("div", { ref: chartRef, style: { width: '100%', height: "".concat(height, "px") } }));
};

var StyledTable = styled(antd.Table)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-table-cell {\n    padding: 8px 12px !important;\n\n    .cell-content {\n      max-width: 200px;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n  }\n\n  .highlight {\n    background-color: #fff2e8;\n    padding: 0 2px;\n  }\n"], ["\n  .ant-table-cell {\n    padding: 8px 12px !important;\n\n    .cell-content {\n      max-width: 200px;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n  }\n\n  .highlight {\n    background-color: #fff2e8;\n    padding: 0 2px;\n  }\n"])));
var LineTable = function (_a) {
    var data = _a.data, _b = _a.colorMap, colorMap = _b === void 0 ? {} : _b, _c = _a.checkedItems, checkedItems = _c === void 0 ? [] : _c; _a.onItemCheck; var _d = _a.height, height = _d === void 0 ? 400 : _d;
    var _e = react.useState(''), searchText = _e[0], setSearchText = _e[1];
    var _f = react.useState(''), searchColumn = _f[0], setSearchColumn = _f[1];
    var columns = react.useMemo(function () {
        if (!data || data.length === 0)
            return [];
        var allKeys = new Set();
        data.forEach(function (item) {
            Object.keys(item).forEach(function (key) { return allKeys.add(key); });
        });
        return Array.from(allKeys)
            .filter(function (key) { return key !== 'key'; })
            .map(function (key) { return ({
            title: key,
            dataIndex: key,
            key: key,
            width: key === 'time' ? 180 : 150,
            render: function (text, record) {
                var displayText = String(text || '');
                var highlighted = searchText && searchColumn === key
                    ? displayText.replace(new RegExp("(".concat(searchText, ")"), 'gi'), '<span class="highlight">$1</span>')
                    : displayText;
                return (jsxRuntime.jsx("div", { className: "cell-content", style: {
                        color: colorMap[key] || '#000',
                        fontWeight: checkedItems.includes(key) ? 'bold' : 'normal',
                    }, dangerouslySetInnerHTML: { __html: highlighted }, title: displayText }));
            },
            sorter: function (a, b) {
                var aVal = String(a[key] || '');
                var bVal = String(b[key] || '');
                return aVal.localeCompare(bVal);
            },
        }); });
    }, [data, searchText, searchColumn, colorMap, checkedItems]);
    var filteredData = react.useMemo(function () {
        if (!searchText || !searchColumn)
            return data;
        return data.filter(function (item) {
            var value = String(item[searchColumn] || '').toLowerCase();
            return value.includes(searchText.toLowerCase());
        });
    }, [data, searchText, searchColumn]);
    return (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsxs("div", __assign({ style: {
                    marginBottom: 16,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                } }, { children: [jsxRuntime.jsx(antd.Input.Search, { placeholder: searchColumn ? "\u5728 ".concat(searchColumn, " \u5217\u4E2D\u641C\u7D22...") : '请先选择搜索列', value: searchText, onChange: function (e) { return setSearchText(e.target.value); }, onSearch: function (value) { return setSearchText(value); }, disabled: !searchColumn, style: { width: 300 }, prefix: jsxRuntime.jsx(icons.SearchOutlined, {}) }), jsxRuntime.jsxs(antd.Space, { children: [columns.map(function (col) { return (jsxRuntime.jsx(antd.Button, __assign({ size: "small", type: searchColumn === col.key ? 'primary' : 'default', onClick: function () {
                                    setSearchColumn(col.key);
                                    setSearchText('');
                                } }, { children: col.title }), col.key)); }), searchColumn && (jsxRuntime.jsx(antd.Button, __assign({ size: "small", onClick: function () {
                                    setSearchText('');
                                    setSearchColumn('');
                                } }, { children: "\u6E05\u9664" })))] })] })), jsxRuntime.jsx(StyledTable, { columns: columns, dataSource: filteredData, pagination: {
                    pageSize: 50,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: function (total) { return "\u5171 ".concat(total, " \u6761\u8BB0\u5F55"); },
                }, scroll: { y: height - 100, x: 'max-content' }, size: "small", bordered: true })] }));
};
var templateObject_1;

function useChartData(dataSource, params, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = react.useState(null), data = _a[0], setData = _a[1];
    var _b = react.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react.useState(null), error = _c[0], setError = _c[1];
    // 使用 ref 来存储 options，避免依赖数组问题
    var optionsRef = react.useRef(options);
    optionsRef.current = options;
    var fetchData = react.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!dataSource || !params)
                        return [2 /*return*/];
                    setLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dataSource.fetchData(params)];
                case 2:
                    result = _c.sent();
                    setData(result);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _c.sent();
                    error_1 = err_1 instanceof Error ? err_1 : new Error('Unknown error');
                    setError(error_1);
                    (_b = (_a = optionsRef.current).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [dataSource, params]); // 移除 options 依赖
    react.useEffect(function () {
        fetchData();
    }, [fetchData]);
    react.useEffect(function () {
        if (optionsRef.current.autoRefresh && optionsRef.current.refreshInterval) {
            var interval_1 = setInterval(fetchData, optionsRef.current.refreshInterval);
            return function () { return clearInterval(interval_1); };
        }
    }, [fetchData, options.autoRefresh, options.refreshInterval]); // 保留这些基本类型的依赖
    var refetch = react.useCallback(function () {
        fetchData();
    }, [fetchData]);
    return {
        data: data,
        loading: loading,
        error: error,
        refetch: refetch,
    };
}

var RangePicker = antd.DatePicker.RangePicker;
var Option = antd.Select.Option;
var MetricChartPlugin = function (_a) {
    var dataSource = _a.dataSource, defaultTimeRange = _a.defaultTimeRange, _b = _a.defaultStep, defaultStep = _b === void 0 ? 60 : _b, _c = _a.title, title = _c === void 0 ? '指标图表' : _c, _d = _a.height, height = _d === void 0 ? 400 : _d, _e = _a.showControls, showControls = _e === void 0 ? true : _e, onTimeRangeChange = _a.onTimeRangeChange, onStepChange = _a.onStepChange;
    var _f = react.useState(defaultTimeRange || [Date.now() - 3600000, Date.now()]), timeRange = _f[0], setTimeRange = _f[1];
    var _g = react.useState(defaultStep), step = _g[0], setStep = _g[1];
    var _h = react.useState('both'), viewMode = _h[0], setViewMode = _h[1];
    var queryParams = react.useMemo(function () { return ({
        startTime: Math.floor(timeRange[0] / 1000),
        endTime: Math.floor(timeRange[1] / 1000),
        step: step,
    }); }, [timeRange, step]);
    var _j = useChartData(dataSource, queryParams, {
        onError: function (err) {
            console.error('Chart data fetch error:', err);
        },
    }), data = _j.data, loading = _j.loading, error = _j.error, refetch = _j.refetch;
    var tableData = react.useMemo(function () {
        if (!data || !data.series.length)
            return [];
        var result = [];
        var maxLength = Math.max.apply(Math, data.series.map(function (s) { return s.data.length; }));
        var _loop_1 = function (i) {
            var row = {
                key: "row-".concat(i),
                time: data.timestamps[i]
                    ? new Date(data.timestamps[i]).toLocaleString()
                    : '',
            };
            data.series.forEach(function (series) {
                if (series.data[i]) {
                    row[series.name] = series.data[i][1];
                }
            });
            result.push(row);
        };
        for (var i = 0; i < maxLength; i++) {
            _loop_1(i);
        }
        return result;
    }, [data]);
    var colorMap = react.useMemo(function () {
        var map = {};
        data === null || data === void 0 ? void 0 : data.series.forEach(function (series) {
            if (series.color) {
                map[series.name] = series.color;
            }
        });
        return map;
    }, [data]);
    // 兼容 Ant Design 4.x 的时间处理
    var handleTimeRangeChange = function (dates) {
        if (dates && dates.length === 2) {
            var newRange = [
                dates[0].valueOf(),
                dates[1].valueOf(),
            ];
            setTimeRange(newRange);
            onTimeRangeChange === null || onTimeRangeChange === void 0 ? void 0 : onTimeRangeChange(Math.floor(newRange[0] / 1000), Math.floor(newRange[1] / 1000));
        }
    };
    var handleStepChange = function (newStep) {
        setStep(newStep);
        onStepChange === null || onStepChange === void 0 ? void 0 : onStepChange(newStep);
    };
    var handleExport = function () {
        if (!tableData.length)
            return;
        var csvContent = __spreadArray([
            Object.keys(tableData[0]).join(',')
        ], tableData.map(function (row) { return Object.values(row).join(','); }), true).join('\n');
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "metric-data-".concat(Date.now(), ".csv");
        link.click();
    };
    var stepOptions = [
        { label: '15秒', value: 15 },
        { label: '30秒', value: 30 },
        { label: '1分钟', value: 60 },
        { label: '5分钟', value: 300 },
        { label: '15分钟', value: 900 },
        { label: '30分钟', value: 1800 },
        { label: '1小时', value: 3600 },
    ];
    return (jsxRuntime.jsxs(antd.Card, __assign({ title: title, style: { width: '100%' } }, { children: [showControls && (jsxRuntime.jsx("div", __assign({ style: { marginBottom: 16 } }, { children: jsxRuntime.jsxs(antd.Row, __assign({ gutter: [16, 16], align: "middle" }, { children: [jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsxs(antd.Space, { children: [jsxRuntime.jsx("span", { children: "\u65F6\u95F4\u8303\u56F4:" }), jsxRuntime.jsx(RangePicker, { value: [moment(timeRange[0]), moment(timeRange[1])], onChange: handleTimeRangeChange, showTime: true, format: "YYYY-MM-DD HH:mm:ss" })] }) }), jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsxs(antd.Space, { children: [jsxRuntime.jsx("span", { children: "\u6B65\u957F:" }), jsxRuntime.jsx(antd.Select, __assign({ value: step, onChange: handleStepChange, style: { width: 100 } }, { children: stepOptions.map(function (option) { return (jsxRuntime.jsx(Option, __assign({ value: option.value }, { children: option.label }), option.value)); }) }))] }) }), jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsxs(antd.Space, { children: [jsxRuntime.jsx("span", { children: "\u89C6\u56FE:" }), jsxRuntime.jsxs(antd.Select, __assign({ value: viewMode, onChange: setViewMode, style: { width: 120 } }, { children: [jsxRuntime.jsx(Option, __assign({ value: "chart" }, { children: "\u4EC5\u56FE\u8868" })), jsxRuntime.jsx(Option, __assign({ value: "table" }, { children: "\u4EC5\u8868\u683C" })), jsxRuntime.jsx(Option, __assign({ value: "both" }, { children: "\u56FE\u8868+\u8868\u683C" }))] }))] }) }), jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsxs(antd.Space, { children: [jsxRuntime.jsx(antd.Button, __assign({ icon: jsxRuntime.jsx(icons.ReloadOutlined, {}), onClick: refetch, loading: loading }, { children: "\u5237\u65B0" })), jsxRuntime.jsx(antd.Button, __assign({ icon: jsxRuntime.jsx(icons.DownloadOutlined, {}), onClick: handleExport, disabled: !tableData.length }, { children: "\u5BFC\u51FA" }))] }) })] })) }))), error && (jsxRuntime.jsx(antd.Alert, { message: "\u6570\u636E\u52A0\u8F7D\u5931\u8D25", description: error.message, type: "error", showIcon: true, style: { marginBottom: 16 } })), jsxRuntime.jsxs(antd.Spin, __assign({ spinning: loading }, { children: [(viewMode === 'chart' || viewMode === 'both') && (jsxRuntime.jsx("div", __assign({ style: { marginBottom: viewMode === 'both' ? 24 : 0 } }, { children: jsxRuntime.jsx(Chart, { data: data, height: height, loading: loading, showLegend: true, showTooltip: true }) }))), (viewMode === 'table' || viewMode === 'both') && (jsxRuntime.jsx(LineTable, { data: tableData, colorMap: colorMap, height: viewMode === 'table' ? height : 300 }))] }))] })));
};

var BaseDataSource = /** @class */ (function () {
    function BaseDataSource() {
    }
    BaseDataSource.prototype.validateParams = function (params) {
        if (!params.startTime || !params.endTime) {
            return false;
        }
        if (params.startTime >= params.endTime) {
            return false;
        }
        return true;
    };
    BaseDataSource.prototype.formatTimestamp = function (timestamp) {
        return new Date(timestamp * 1000).toISOString();
    };
    BaseDataSource.prototype.parseMetricData = function (rawData) {
        var _this = this;
        return rawData.map(function (item, index) {
            var _a, _b;
            return ({
                name: ((_a = item.metric) === null || _a === void 0 ? void 0 : _a.name) || "Series ".concat(index + 1),
                data: ((_b = item.values) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                    var time = _a[0], value = _a[1];
                    return [
                        time * 1000,
                        parseFloat(value),
                    ];
                })) || [],
                color: _this.generateColor(index),
            });
        });
    };
    BaseDataSource.prototype.generateColor = function (index) {
        var colors = [
            '#1890ff',
            '#52c41a',
            '#faad14',
            '#f5222d',
            '#722ed1',
            '#13c2c2',
            '#eb2f96',
            '#fa8c16',
        ];
        return colors[index % colors.length];
    };
    return BaseDataSource;
}());

var MetricDataSource = /** @class */ (function (_super) {
    __extends(MetricDataSource, _super);
    function MetricDataSource(apiEndpoint, headers) {
        if (headers === void 0) { headers = {}; }
        var _this = _super.call(this) || this;
        _this.apiEndpoint = apiEndpoint;
        _this.headers = __assign({ 'Content-Type': 'application/json' }, headers);
        return _this;
    }
    MetricDataSource.prototype.fetchData = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParams, response, rawData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.validateParams(params)) {
                            throw new Error('Invalid query parameters');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        queryParams = new URLSearchParams(__assign({ start: params.startTime.toString(), end: params.endTime.toString(), step: (params.step || 60).toString() }, params.filters));
                        return [4 /*yield*/, fetch("".concat(this.apiEndpoint, "?").concat(queryParams), {
                                method: 'GET',
                                headers: this.headers,
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        rawData = _a.sent();
                        return [2 /*return*/, this.transformData(rawData, params)];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Failed to fetch metric data:', error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MetricDataSource.prototype.transformData = function (rawData, params) {
        var _a, _b;
        var series = this.parseMetricData(((_a = rawData.data) === null || _a === void 0 ? void 0 : _a.result) || []);
        var timestamps = this.generateTimestamps(params.startTime, params.endTime, params.step || 60);
        return {
            series: series,
            timestamps: timestamps,
            metadata: {
                query: rawData.query,
                resultType: (_b = rawData.data) === null || _b === void 0 ? void 0 : _b.resultType,
                executionTime: rawData.executionTime,
            },
        };
    };
    MetricDataSource.prototype.generateTimestamps = function (start, end, step) {
        var timestamps = [];
        for (var time = start; time <= end; time += step) {
            timestamps.push(time * 1000);
        }
        return timestamps;
    };
    return MetricDataSource;
}(BaseDataSource));

exports.BaseDataSource = BaseDataSource;
exports.Chart = Chart;
exports.LineTable = LineTable;
exports.MetricChartPlugin = MetricChartPlugin;
exports.MetricDataSource = MetricDataSource;
exports.useChartData = useChartData;
//# sourceMappingURL=index.js.map
