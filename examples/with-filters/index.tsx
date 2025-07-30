import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MetricChartPlugin, BaseDataSource } from 'react-metric-chart-plugin';
import { ChartQueryParams, ChartData } from 'react-metric-chart-plugin';
import { Select, Card, Space } from 'antd';
import 'antd/dist/reset.css';

const { Option } = Select;

// 支持过滤器的数据源
class FilterableDataSource extends BaseDataSource {
  async fetchData(params: ChartQueryParams): Promise<ChartData> {
    const { startTime, endTime, step = 60, filters = {} } = params;
    const { instance, metric_type } = filters;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const timestamps: number[] = [];
    const series: Array<{ name: string; data: Array<[number, number]>; color?: string }> = [];
    
    // 根据过滤器生成不同的数据
    const instances = instance ? [instance] : ['server-1', 'server-2', 'server-3'];
    const metrics = metric_type ? [metric_type] : ['cpu', 'memory', 'disk'];
    
    for (let time = startTime; time <= endTime; time += step) {
      timestamps.push(time);
    }
    
    instances.forEach((inst, instIndex) => {
      metrics.forEach((metric, metricIndex) => {
        const data: Array<[number, number]> = [];
        
        for (let time = startTime; time <= endTime; time += step) {
          const baseValue = (instIndex + 1) * 20 + (metricIndex + 1) * 10;
          const randomValue = baseValue + Math.random() * 30;
          data.push([time * 1000, Math.min(randomValue, 100)]);
        }
        
        series.push({
          name: `${inst}-${metric}`,
          data,
          color: this.getColor(instIndex * metrics.length + metricIndex)
        });
      });
    });
    
    return {
      series,
      timestamps,
      metadata: {
        filters: { instance, metric_type },
        total_series: series.length
      }
    };
  }
  
  private getColor(index: number): string {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
    return colors[index % colors.length];
  }
}

const App: React.FC = () => {
  const [dataSource] = useState(() => new FilterableDataSource());
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [key, setKey] = useState(0); // 用于强制重新渲染
  
  const handleFilterChange = (filterKey: string, value: any) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    
    // 更新数据源的过滤器
    dataSource.updateFilters?.(newFilters);
    
    // 强制重新渲染组件
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Metric Chart Plugin - 过滤器示例</h1>
      
      <Card title="过滤器" style={{ marginBottom: '20px' }}>
        <Space>
          <div>
            <label>实例: </label>
            <Select
              style={{ width: 120 }}
              placeholder="选择实例"
              allowClear
              onChange={(value) => handleFilterChange('instance', value)}
            >
              <Option value="server-1">Server 1</Option>
              <Option value="server-2">Server 2</Option>
              <Option value="server-3">Server 3</Option>
            </Select>
          </div>
          
          <div>
            <label>指标类型: </label>
            <Select
              style={{ width: 120 }}
              placeholder="选择指标"
              allowClear
              onChange={(value) => handleFilterChange('metric_type', value)}
            >
              <Option value="cpu">CPU</Option>
              <Option value="memory">Memory</Option>
              <Option value="disk">Disk</Option>
            </Select>
          </div>
        </Space>
      </Card>
      
      <MetricChartPlugin
        key={key}
        dataSource={dataSource}
        title="多实例监控指标"
        height={400}
        defaultTimeRange={[Date.now() - 3600000, Date.now()]}
        defaultStep={60}
        showControls={true}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);