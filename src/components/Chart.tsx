import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { ChartProps } from '../types';

export const Chart: React.FC<ChartProps> = ({
  options,
  height = 400,
  loading = false,
  visibleSeries = [],
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    // 处理系列过滤
    let processedOptions = { ...options };
    if (visibleSeries.length > 0 && options?.series) {
      processedOptions.series = options.series.filter((series: any) => 
        visibleSeries.includes(series.name)
      );
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
    } else {
      chart.hideLoading();
      if (processedOptions) {
        chart.setOption(processedOptions, true);
      }
    }

    // 响应式调整
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [options, loading, visibleSeries]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
  );
};
