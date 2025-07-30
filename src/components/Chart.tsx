import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { ChartProps } from '../types';

export const Chart: React.FC<ChartProps> = ({
  data,
  height = 400,
  loading = false,
  title,
  showLegend = true,
  showTooltip = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    // 配置图表选项
    const option: echarts.EChartsOption = {
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
            formatter: (params: any) => {
              if (!Array.isArray(params)) return '';

              const time = new Date(params[0].axisValue).toLocaleString();
              let content = `<div style="margin-bottom: 4px;">${time}</div>`;

              params.forEach((param: any) => {
                content += `
              <div style="display: flex; align-items: center; margin-bottom: 2px;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${
                  param.color
                }; border-radius: 50%; margin-right: 8px;"></span>
                <span style="margin-right: 8px;">${param.seriesName}:</span>
                <span style="font-weight: bold;">${
                  param.value[1]?.toFixed(2) || 'N/A'
                }</span>
              </div>
            `;
              });

              return content;
            },
          }
        : undefined,
      legend: showLegend
        ? {
            type: 'scroll',
            bottom: 10,
            data: data?.series.map((s) => s.name) || [],
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
          formatter: (value: number) => {
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
      series:
        data?.series.map((series) => ({
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
        })) || [],
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
    } else {
      chart.hideLoading();
      chart.setOption(option, true);
    }

    // 响应式调整
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, loading, title, showLegend, showTooltip]);

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
