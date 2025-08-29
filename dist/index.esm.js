import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Input, Space, Button, Table, Select, Card, Row, Col } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import styled from 'styled-components';

/******************************************************************************
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Chart = function (_a) {
    var options = _a.options, _b = _a.height, height = _b === void 0 ? 400 : _b, _c = _a.loading, loading = _c === void 0 ? false : _c, _d = _a.visibleSeries, visibleSeries = _d === void 0 ? [] : _d;
    var chartRef = useRef(null);
    var chartInstance = useRef(null);
    useEffect(function () {
        if (!chartRef.current)
            return;
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }
        var chart = chartInstance.current;
        // 处理系列过滤
        var processedOptions = __assign({}, options);
        if (visibleSeries.length > 0 && (options === null || options === void 0 ? void 0 : options.series)) {
            processedOptions.series = options.series.filter(function (series) {
                return visibleSeries.includes(series.name);
            });
        }
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
            if (processedOptions) {
                chart.setOption(processedOptions, true);
            }
        }
        // 响应式调整
        var handleResize = function () {
            chart.resize();
        };
        window.addEventListener('resize', handleResize);
        return function () {
            window.removeEventListener('resize', handleResize);
        };
    }, [options, loading, visibleSeries]);
    useEffect(function () {
        return function () {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, []);
    return (jsx("div", { ref: chartRef, style: { width: '100%', height: "".concat(height, "px") } }));
};

// 版本检测
var getAntdVersion = function () {
    try {
        var antd = require('antd/package.json');
        return antd.version.startsWith('4') ? '4' : '5';
    }
    catch (_a) {
        return '5'; // 默认假设为 5.x
    }
};
var isAntd4 = function () { return getAntdVersion() === '4'; };
// Table 兼容性
var getTableProps = function () {
    if (isAntd4()) {
        return {
            // Ant Design 4.x 特有的属性
            size: 'middle',
        };
    }
    else {
        return {
            // Ant Design 5.x 特有的属性
            size: 'middle',
            virtual: true,
        };
    }
};
// 图标兼容性
var getIconComponent = function (iconName) {
    try {
        if (isAntd4()) {
            // Ant Design 4.x 图标导入方式
            var icons = require('@ant-design/icons');
            return icons[iconName];
        }
        else {
            // Ant Design 5.x 图标导入方式（相同）
            var icons = require('@ant-design/icons');
            return icons[iconName];
        }
    }
    catch (_a) {
        return null;
    }
};

var TableContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-table-cell {\n    padding: 8px 12px !important;\n\n    .cell-content {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n  }\n\n  .highlight {\n    background-color: #fff2e8;\n    padding: 0 2px;\n  }\n\n  .color-indicator {\n    display: inline-block;\n    width: 12px;\n    height: 12px;\n    border-radius: 2px;\n    margin-right: 8px;\n    vertical-align: middle;\n  }\n"], ["\n  .ant-table-cell {\n    padding: 8px 12px !important;\n\n    .cell-content {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n    }\n  }\n\n  .highlight {\n    background-color: #fff2e8;\n    padding: 0 2px;\n  }\n\n  .color-indicator {\n    display: inline-block;\n    width: 12px;\n    height: 12px;\n    border-radius: 2px;\n    margin-right: 8px;\n    vertical-align: middle;\n  }\n"])));
var LineTable = function (_a) {
    var data = _a.data, _b = _a.colorMap, colorMap = _b === void 0 ? {} : _b, _c = _a.checkedItems, checkedItems = _c === void 0 ? [] : _c, onItemCheck = _a.onItemCheck, _d = _a.height, height = _d === void 0 ? 400 : _d, _e = _a.usePagination, usePagination = _e === void 0 ? true : _e, _f = _a.maxHeight, maxHeight = _f === void 0 ? 600 : _f;
    var _g = useState(''), searchText = _g[0], setSearchText = _g[1];
    var _h = useState(''), searchColumn = _h[0], setSearchColumn = _h[1];
    var columns = useMemo(function () {
        if (!data || data.length === 0)
            return [];
        var allKeys = new Set();
        data.forEach(function (item) {
            Object.keys(item).forEach(function (key) { return allKeys.add(key); });
        });
        return Array.from(allKeys)
            .filter(function (key) { return key !== 'key' && key !== 'time'; })
            .map(function (key) {
            var isNameColumn = key === 'name';
            var isNumericColumn = ['current', 'average', 'maximum', 'minimum'].includes(key);
            var isSearchableColumn = isNameColumn;
            return {
                title: key === 'name' ? '系列名称' :
                    key === 'current' ? '当前值' :
                        key === 'average' ? '平均值' :
                            key === 'maximum' ? '最大值' :
                                key === 'minimum' ? '最小值' : key,
                dataIndex: key,
                key: key,
                width: isNameColumn ? 300 : 120,
                sorter: !isNameColumn ? (isNumericColumn ? {
                    compare: function (a, b) {
                        var aVal = parseFloat(a[key]) || 0;
                        var bVal = parseFloat(b[key]) || 0;
                        return aVal - bVal;
                    },
                    multiple: 1,
                } : {
                    compare: function (a, b) {
                        var _a, _b;
                        var aStr = ((_a = a[key]) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                        var bStr = ((_b = b[key]) === null || _b === void 0 ? void 0 : _b.toString()) || '';
                        return aStr.localeCompare(bStr);
                    },
                    multiple: 2,
                }) : undefined,
                render: function (text, record) {
                    var displayText = (text === null || text === void 0 ? void 0 : text.toString()) || '';
                    var hasValidSearch = searchColumn === key && Boolean(searchText === null || searchText === void 0 ? void 0 : searchText.trim());
                    var isHighlighted = hasValidSearch && displayText.toLowerCase().includes(searchText.toLowerCase());
                    if (isNameColumn) {
                        var color = colorMap[record.name] || '#1890ff';
                        return (jsxs("div", __assign({ className: "cell-content", style: { display: 'flex', alignItems: 'center' } }, { children: [jsx("span", { className: "color-indicator", style: { backgroundColor: color } }), isHighlighted ? (jsx("span", { dangerouslySetInnerHTML: {
                                        __html: displayText.replace(new RegExp(searchText, 'gi'), function (match) { return "<span class=\"highlight\">".concat(match, "</span>"); }),
                                    } })) : (displayText)] })));
                    }
                    return (jsx("div", __assign({ className: "cell-content" }, { children: isHighlighted ? (jsx("span", { dangerouslySetInnerHTML: {
                                __html: displayText.replace(new RegExp(searchText, 'gi'), function (match) { return "<span class=\"highlight\">".concat(match, "</span>"); }),
                            } })) : (displayText) })));
                },
                filterDropdown: isSearchableColumn ? function (_a) {
                    var setSelectedKeys = _a.setSelectedKeys, selectedKeys = _a.selectedKeys, confirm = _a.confirm, clearFilters = _a.clearFilters;
                    return (jsxs("div", __assign({ style: { padding: 8 } }, { children: [jsx(Input, { placeholder: "\u641C\u7D22 ".concat(key === 'name' ? '系列名称' : key), value: selectedKeys[0], onChange: function (e) { return setSelectedKeys(e.target.value ? [e.target.value] : []); }, onPressEnter: function () {
                                    confirm();
                                    setSearchText(selectedKeys[0]);
                                    setSearchColumn(key);
                                }, style: { marginBottom: 8, display: 'block' } }), jsxs(Space, { children: [jsx(Button, __assign({ type: "primary", onClick: function () {
                                            confirm();
                                            setSearchText(selectedKeys[0]);
                                            setSearchColumn(key);
                                        }, icon: React.createElement(getIconComponent('SearchOutlined') || 'span'), size: "small", style: { width: 90 } }, { children: "\u641C\u7D22" })), jsx(Button, __assign({ onClick: function () {
                                            clearFilters && clearFilters();
                                            setSearchText('');
                                            setSearchColumn('');
                                        }, size: "small", style: { width: 90 } }, { children: "\u91CD\u7F6E" }))] })] })));
                } : undefined,
                filterIcon: isSearchableColumn ? function (filtered) {
                    var SearchIcon = getIconComponent('SearchOutlined');
                    return SearchIcon ? React.createElement(SearchIcon, {
                        style: { color: filtered ? '#1890ff' : undefined }
                    }) : null;
                } : undefined,
            };
        });
    }, [data, colorMap, searchText, searchColumn]);
    var filteredData = useMemo(function () {
        if (!searchText || !searchColumn)
            return data;
        return data.filter(function (item) {
            var value = item[searchColumn];
            return value === null || value === void 0 ? void 0 : value.toString().toLowerCase().includes(searchText.toLowerCase());
        });
    }, [data, searchText, searchColumn]);
    // 计算表格滚动配置
    var scrollConfig = useMemo(function () {
        if (usePagination) {
            return { y: height - 100, x: 'max-content' };
        }
        else {
            return { y: maxHeight - 150, x: 'max-content' };
        }
    }, [usePagination, height, maxHeight]);
    // 获取兼容的Table属性
    var compatibleTableProps = getTableProps();
    return (jsxs(Fragment, { children: [jsx(Fragment, { children: jsx(Space, { children: searchText && (jsx(Button, __assign({ onClick: function () {
                            setSearchText('');
                            setSearchColumn('');
                        } }, { children: "\u6E05\u9664\u641C\u7D22" }))) }) }), jsx(TableContainer, { children: jsx(Table, __assign({}, compatibleTableProps, { columns: columns, dataSource: filteredData, pagination: usePagination ? {
                        pageSize: 50,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: function (total) { return "\u5171 ".concat(total, " \u6761\u8BB0\u5F55"); },
                    } : false, scroll: scrollConfig, size: "small", bordered: true, rowSelection: {
                        selectedRowKeys: checkedItems,
                        onChange: function (selectedRowKeys, selectedRows) {
                            onItemCheck && onItemCheck(selectedRows.map(function (item) { return item.name; }));
                        },
                        getCheckboxProps: function (record) { return ({
                            name: record.name,
                        }); },
                        columnWidth: 50, // 新增：设置勾选框列宽度为50px
                    } })) })] }));
};
var templateObject_1;

// 安全地获取Option，避免测试环境中的undefined错误
var Option = (Select || { Option: null }).Option;
var MetricChartPlugin = function (_a) {
    var chartOptions = _a.chartOptions, _b = _a.statsData, statsData = _b === void 0 ? [] : _b, _c = _a.title, title = _c === void 0 ? '指标图表' : _c, _d = _a.height, height = _d === void 0 ? 400 : _d, _e = _a.showControls, showControls = _e === void 0 ? true : _e, _f = _a.showTable, showTable = _f === void 0 ? true : _f, _g = _a.usePagination, usePagination = _g === void 0 ? true : _g, _h = _a.maxHeight, maxHeight = _h === void 0 ? 600 : _h, onExport = _a.onExport, onRefresh = _a.onRefresh;
    var _j = useState('both'), viewMode = _j[0], setViewMode = _j[1];
    var _k = useState([]), checkedItems = _k[0], setCheckedItems = _k[1];
    var _l = useState(false), loading = _l[0], setLoading = _l[1];
    // 将统计数据转换为表格数据
    var tableData = useMemo(function () {
        return statsData.map(function (stat) {
            var _a, _b, _c, _d;
            return ({
                key: stat.name,
                name: stat.name,
                current: ((_a = stat.current) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '-',
                maximum: ((_b = stat.maximum) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '-',
                minimum: ((_c = stat.minimum) === null || _c === void 0 ? void 0 : _c.toFixed(2)) || '-',
                average: ((_d = stat.average) === null || _d === void 0 ? void 0 : _d.toFixed(2)) || '-',
            });
        });
    }, [statsData]);
    // 生成颜色映射
    var colorMap = useMemo(function () {
        var map = {};
        statsData.forEach(function (stat) {
            if (stat.color) {
                map[stat.name] = stat.color;
            }
        });
        return map;
    }, [statsData]);
    var handleItemCheck = function (selectedRowKeys) {
        setCheckedItems(selectedRowKeys);
    };
    var handleExport = function () {
        if (!tableData.length)
            return;
        if (onExport) {
            onExport(statsData);
        }
        else {
            // 默认导出CSV
            var csvContent = __spreadArray([
                Object.keys(tableData[0]).join(',')
            ], tableData.map(function (row) { return Object.values(row).join(','); }), true).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "metric-data-".concat(Date.now(), ".csv");
            link.click();
        }
    };
    var handleRefresh = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onRefresh) return [3 /*break*/, 4];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onRefresh()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (jsxs(Card, __assign({ size: 'small', title: title, style: { width: '100%' } }, { children: [showControls && (jsx("div", __assign({ style: { marginBottom: 16 } }, { children: jsxs(Row, __assign({ gutter: [16, 16], align: "middle" }, { children: [jsx(Col, { children: jsxs(Space, { children: [jsx("span", { children: "\u89C6\u56FE:" }), jsxs(Select, __assign({ value: viewMode, onChange: setViewMode, style: { width: 120 } }, { children: [jsx(Option, __assign({ value: "chart" }, { children: "\u4EC5\u56FE\u8868" })), showTable && jsx(Option, __assign({ value: "table" }, { children: "\u4EC5\u8868\u683C" })), showTable && jsx(Option, __assign({ value: "both" }, { children: "\u56FE\u8868+\u8868\u683C" }))] }))] }) }), jsx(Col, { children: jsxs(Space, { children: [onRefresh && (jsx(Button, __assign({ icon: jsx(ReloadOutlined, {}), onClick: handleRefresh, loading: loading }, { children: "\u5237\u65B0" }))), showTable && (jsx(Button, __assign({ icon: jsx(DownloadOutlined, {}), onClick: handleExport, disabled: !tableData.length }, { children: "\u5BFC\u51FA" })))] }) })] })) }))), (viewMode === 'chart' || viewMode === 'both') && (jsx("div", __assign({ style: { marginBottom: viewMode === 'both' ? 8 : 0 } }, { children: jsx(Chart, { options: chartOptions, height: height, loading: loading, visibleSeries: checkedItems }) }))), showTable && (viewMode === 'table' || viewMode === 'both') && (jsx(LineTable, { data: tableData, colorMap: colorMap, height: viewMode === 'table' ? height : 300, onItemCheck: handleItemCheck, checkedItems: checkedItems, usePagination: usePagination, maxHeight: maxHeight }))] })));
};

function useChartData(dataSource, params, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = useState(null), data = _a[0], setData = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    // 使用 ref 来存储 options，避免依赖数组问题
    var optionsRef = useRef(options);
    optionsRef.current = options;
    var fetchData = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
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
    useEffect(function () {
        fetchData();
    }, [fetchData]);
    useEffect(function () {
        if (optionsRef.current.autoRefresh && optionsRef.current.refreshInterval) {
            var interval_1 = setInterval(fetchData, optionsRef.current.refreshInterval);
            return function () { return clearInterval(interval_1); };
        }
    }, [fetchData, options.autoRefresh, options.refreshInterval]); // 保留这些基本类型的依赖
    var refetch = useCallback(function () {
        fetchData();
    }, [fetchData]);
    return {
        data: data,
        loading: loading,
        error: error,
        refetch: refetch,
    };
}

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

export { BaseDataSource, Chart, LineTable, MetricChartPlugin, MetricDataSource, useChartData };
//# sourceMappingURL=index.esm.js.map
