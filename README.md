# React Metric Chart Plugin

一个灵活且可定制的 React 指标图表插件，直接支持 ECharts 配置和统计数据展示。

## 特性

- 🚀 开箱即用的图表组件
- 📊 直接支持 ECharts 配置选项
- 📈 内置统计数据表格
- 🎨 可定制的样式和主题
- 📱 响应式设计
- 🔍 内置数据过滤和搜索
- 🧪 完整的 TypeScript 支持
- 📋 支持数据导出功能

## 安装

```bash
npm install react-metric-chart-plugin
# 或
yarn add react-metric-chart-plugin
```

## 快速开始

```tsx
import React from 'react';
import { MetricChartPlugin } from 'react-metric-chart-plugin';
import type { MetricStats } from 'react-metric-chart-plugin';

function App() {
  // ECharts 配置选项
  const chartOptions = {
    title: {
      text: '系统监控',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        data: [
          [new Date('2024-01-01 10:00:00').getTime(), 45.2],
          [new Date('2024-01-01 10:01:00').getTime(), 52.1],
          // 更多数据点...
        ],
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  // 统计数据
  const statsData: MetricStats[] = [
    {
      name: 'CPU使用率',
      current: 52.1,
      maximum: 65.3,
      minimum: 32.8,
      average: 48.7,
      color: '#1890ff'
    }
  ];

  return (
    <MetricChartPlugin
      chartOptions={chartOptions}
      statsData={statsData}
      title="系统监控"
      height={400}
      showTable={true}
      onRefresh={() => console.log('刷新数据')}
    />
  );
}
```

## API 文档

### MetricChartPluginProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| chartOptions | any | - | ECharts 配置选项对象 |
| statsData | MetricStats[] | [] | 统计数据数组 |
| title | string | '指标图表' | 图表标题 |
| height | number | 400 | 图表高度 |
| showControls | boolean | true | 是否显示控制栏 |
| showTable | boolean | true | 是否显示数据表格 |
| usePagination | boolean | true | 表格是否使用分页 |
| maxHeight | number | 600 | 不使用分页时表格最大高度 |
| onRefresh | () => void | - | 刷新回调函数 |
| onExport | (data: MetricStats[]) => void | - | 导出回调函数 |

### MetricStats

| 属性 | 类型 | 说明 |
|------|------|------|
| name | string | 指标名称 |
| current | number | 当前值 |
| maximum | number | 最大值 |
| minimum | number | 最小值 |
| average | number | 平均值 |
| color | string | 颜色（用于图表和表格） |

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## 许可证

MIT