import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MetricChartPlugin, MetricStats } from 'react-metric-chart-plugin';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // ECharts配置选项
  const chartOptions = {
    title: {
      text: '系统资源监控',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      bottom: 10,
      data: ['CPU使用率', '内存使用率', '磁盘使用率']
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        smooth: true,
        data: [
          [new Date('2024-01-01 10:00:00').getTime(), 45.2],
          [new Date('2024-01-01 10:01:00').getTime(), 52.1],
          [new Date('2024-01-01 10:02:00').getTime(), 48.7],
          [new Date('2024-01-01 10:03:00').getTime(), 61.3],
          [new Date('2024-01-01 10:04:00').getTime(), 55.8],
        ],
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '内存使用率',
        type: 'line',
        smooth: true,
        data: [
          [new Date('2024-01-01 10:00:00').getTime(), 67.8],
          [new Date('2024-01-01 10:01:00').getTime(), 69.2],
          [new Date('2024-01-01 10:02:00').getTime(), 71.5],
          [new Date('2024-01-01 10:03:00').getTime(), 68.9],
          [new Date('2024-01-01 10:04:00').getTime(), 72.1],
        ],
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '磁盘使用率',
        type: 'line',
        smooth: true,
        data: [
          [new Date('2024-01-01 10:00:00').getTime(), 23.4],
          [new Date('2024-01-01 10:01:00').getTime(), 24.1],
          [new Date('2024-01-01 10:02:00').getTime(), 23.8],
          [new Date('2024-01-01 10:03:00').getTime(), 25.2],
          [new Date('2024-01-01 10:04:00').getTime(), 24.7],
        ],
        itemStyle: {
          color: '#faad14'
        }
      }
    ]
  };

  // 统计数据
  const statsData: MetricStats[] = [
    {
      name: 'CPU使用率',
      current: 55.8,
      maximum: 61.3,
      minimum: 45.2,
      average: 52.6,
      color: '#1890ff'
    },
    {
      name: '内存使用率',
      current: 72.1,
      maximum: 72.1,
      minimum: 67.8,
      average: 69.9,
      color: '#52c41a'
    },
    {
      name: '磁盘使用率',
      current: 24.7,
      maximum: 25.2,
      minimum: 23.4,
      average: 24.2,
      color: '#faad14'
    }
  ];

  const handleRefresh = async () => {
    setLoading(true);
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = (data: MetricStats[]) => {
    console.log('导出数据:', data);
  };

  return (
    <div style={{ padding: 24 }}>
      <MetricChartPlugin
        chartOptions={chartOptions}
        statsData={statsData}
        title="系统资源监控"
        height={400}
        showControls={true}
        showTable={true}
        usePagination={false}
        maxHeight={300}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);