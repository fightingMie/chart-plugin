import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MetricChartPlugin, BaseDataSource } from 'react-metric-chart-plugin';
import { ChartQueryParams, ChartData, MetricStats } from 'react-metric-chart-plugin';
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
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [statsData, setStatsData] = useState<MetricStats[]>([]);
  const [loading, setLoading] = useState(false);
  
  const dataSource = new PrometheusDataSource('http://localhost:9090');
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const params: ChartQueryParams = {
        startTime: Math.floor((Date.now() - 7200000) / 1000), // 2小时前
        endTime: Math.floor(Date.now() / 1000), // 现在
        step: 300 // 5分钟间隔
      };
      
      const data = await dataSource.fetchData(params);
      
      // 转换为ECharts格式
      const echartsOptions = {
        title: {
          text: 'Prometheus监控指标'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: data.series.map(s => s.name)
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
        series: data.series.map(s => ({
          name: s.name,
          type: 'line',
          data: s.data,
          smooth: true,
          lineStyle: {
            color: s.color
          },
          itemStyle: {
            color: s.color
          }
        }))
      };
      
      setChartOptions(echartsOptions);
      
      // 计算统计数据
      const stats: MetricStats[] = data.series.map(series => {
        const values = series.data.map(([, value]) => value);
        return {
          name: series.name,
          current: values[values.length - 1],
          maximum: Math.max(...values),
          minimum: Math.min(...values),
          average: values.reduce((a, b) => a + b, 0) / values.length,
          color: series.color
        };
      });
      
      setStatsData(stats);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (!chartOptions) {
    return <div>加载中...</div>;
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Metric Chart Plugin - 自定义数据源示例</h1>
      <MetricChartPlugin
        chartOptions={chartOptions}
        statsData={statsData}
        title="Prometheus监控指标"
        height={500}
        showControls={true}
        showTable={true}
        onRefresh={fetchData}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);