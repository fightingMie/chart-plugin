# React Metric Chart Plugin

一个灵活且可定制的 React 指标图表插件，支持多种数据源和自定义配置。

## 特性

- 🚀 开箱即用的图表组件
- 🔧 灵活的数据源适配器
- 📊 支持多种图表类型
- 🎨 可定制的样式和主题
- 📱 响应式设计
- 🔍 内置数据过滤和搜索
- 📈 实时数据更新
- 🧪 完整的 TypeScript 支持

## 安装

```bash
npm install react-metric-chart-plugin
# 或
yarn add react-metric-chart-plugin
```

## 快速开始

```tsx
import React from 'react';
import { MetricChartPlugin, BaseDataSource } from 'react-metric-chart-plugin';

// 创建自定义数据源
class MyDataSource extends BaseDataSource {
  async fetchData(params) {
    // 实现你的数据获取逻辑
    const response = await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return response.json();
  }
}

function App() {
  const dataSource = new MyDataSource();
  
  return (
    <MetricChartPlugin
      dataSource={dataSource}
      chartIds={['chart1', 'chart2']}
      showHeader={true}
      showTable={true}
    />
  );
}
```

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