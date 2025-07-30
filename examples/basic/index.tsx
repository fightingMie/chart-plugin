import React from 'react';
import ReactDOM from 'react-dom/client';
// 引入插件
import { MetricChartPlugin, BaseDataSource } from 'react-metric-chart-plugin';
import { ChartQueryParams, ChartData } from 'react-metric-chart-plugin';
import 'antd/dist/reset.css';

// 模拟数据源
class MockDataSource extends BaseDataSource {
  async fetchData(params: ChartQueryParams): Promise<ChartData> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { startTime, endTime, step = 60 } = params;
    const timestamps: number[] = [];
    const cpuData: Array<[number, number]> = [];
    const memoryData: Array<[number, number]> = [];
    
    // 生成模拟数据
    for (let time = startTime; time <= endTime; time += step) {
      timestamps.push(time);
      cpuData.push([time * 1000, Math.random() * 100]);
      memoryData.push([time * 1000, Math.random() * 80 + 20]);
    }
    
    return {
      series: [
        {
          name: 'CPU使用率',
          data: cpuData,
          color: '#1890ff'
        },
        {
          name: '内存使用率',
          data: memoryData,
          color: '#52c41a'
        }
      ],
      timestamps,
      metadata: {
        unit: '%',
        description: '系统资源使用率'
      }
    };
  }
}

const App: React.FC = () => {
  const dataSource = new MockDataSource();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Metric Chart Plugin - 基础示例</h1>
      <MetricChartPlugin
        dataSource={dataSource}
        title="系统监控指标"
        height={400}
        defaultTimeRange={[Date.now() - 3600000, Date.now()]}
        defaultStep={60}
        showControls={true}
        onTimeRangeChange={(start, end) => {
          console.log('时间范围变更:', new Date(start), new Date(end));
        }}
        onStepChange={(step) => {
          console.log('步长变更:', step);
        }}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);