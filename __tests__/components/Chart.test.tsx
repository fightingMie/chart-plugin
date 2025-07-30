import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Chart } from '../../src/components/Chart';
import { ChartData } from '../../src/types';

// Mock ECharts
jest.mock('echarts', () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn()
  })),
  getInstanceByDom: jest.fn()
}));

const mockData: ChartData = {
  series: [
    {
      name: 'CPU',
      data: [
        [1640995200000, 45],
        [1640995260000, 52],
        [1640995320000, 38]
      ],
      color: '#1890ff'
    },
    {
      name: 'Memory',
      data: [
        [1640995200000, 65],
        [1640995260000, 72],
        [1640995320000, 58]
      ],
      color: '#52c41a'
    }
  ],
  timestamps: [1640995200, 1640995260, 1640995320],
  metadata: {}
};

describe('Chart', () => {
  it('应该正确渲染图表容器', () => {
    render(<Chart data={mockData} height={400} />);
    
    const chartContainer = screen.getByTestId('chart-container');
    expect(chartContainer).toBeInTheDocument();
    expect(chartContainer).toHaveStyle('height: 400px');
  });
  
  it('应该显示加载状态', () => {
    render(<Chart data={mockData} loading={true} />);
    
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument();
  });
  
  it('应该处理空数据', () => {
    const emptyData: ChartData = {
      series: [],
      timestamps: [],
      metadata: {}
    };
    
    render(<Chart data={emptyData} />);
    
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
  
  it('应该使用默认高度', () => {
    render(<Chart data={mockData} />);
    
    const chartContainer = screen.getByTestId('chart-container');
    expect(chartContainer).toHaveStyle('height: 300px');
  });
});