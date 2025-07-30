import React from 'react';
import ReactDOM from 'react-dom/client';
import { MetricChartPlugin, BaseDataSource } from 'react-metric-chart-plugin';
import { ChartQueryParams, ChartData } from 'react-metric-chart-plugin';
import 'antd/dist/reset.css';

// 自定义Prometheus数据源
class PrometheusDataSource extends BaseDataSource {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }
  
  async fetchData(params: ChartQueryParams): Promise<ChartData> {
    const { startTime, endTime, step = 60 } = params;
    
    try {
      // 模拟Prometheus查询
      const queries = [
        'cpu_usage_percent',
        'memory_usage_percent',
        'disk_usage_percent'
      ];
      
      const promises = queries.map(async (query) => {
        const url = `${this.baseUrl}/api/v1/query_range?query=${query}&start=${startTime}&end=${endTime}&step=${step}`;
        
        // 这里应该是真实的API调用
        // const response = await fetch(url);
        // const data = await response.json();
        
        // 模拟数据
        const data: Array<[number, number]> = [];
        for (let time = startTime; time <= endTime; time += step) {
          data.push([time * 1000, Math.random() * 100]);
        }
        
        return {
          name: query.replace('_', ' ').toUpperCase(),
          data,
          color: this.getColorForMetric(query)
        };
      });
      
      const series = await Promise.all(promises);
      const timestamps: number[] = [];
      
      for (let time = startTime; time <= endTime; time += step) {
        timestamps.push(time);
      }
      
      return {
        series,
        timestamps,
        metadata: {
          source: 'Prometheus',
          queries
        }
      };
    } catch (error) {
      console.error('获取数据失败:', error);
      throw error;
    }
  }
  
  private getColorForMetric(metric: string): string {
    const colors: Record<string, string> = {
      'cpu_usage_percent': '#ff4d4f',
      'memory_usage_percent': '#1890ff',
      'disk_usage_percent': '#52c41a'
    };
    return colors[metric] || '#722ed1';
  }
  
  validateParams(params: ChartQueryParams): boolean {
    const { startTime, endTime, step } = params;
    
    if (startTime >= endTime) {
      throw new Error('开始时间必须小于结束时间');
    }
    
    if (step && step < 1) {
      throw new Error('步长必须大于0');
    }
    
    return true;
  }
}

const App: React.FC = () => {
  const dataSource = new PrometheusDataSource('http://localhost:9090');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Metric Chart Plugin - 自定义数据源示例</h1>
      <MetricChartPlugin
        dataSource={dataSource}
        title="Prometheus监控指标"
        height={500}
        defaultTimeRange={[Date.now() - 7200000, Date.now()]}
        defaultStep={300}
        showControls={true}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);