import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chart } from '../../src/components/Chart';

// Mock ECharts
jest.mock('echarts', () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  })),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockOptions = {
  title: { text: 'Test Chart' },
  series: [
    {
      name: 'Series 1',
      type: 'line',
      data: [1, 2, 3, 4, 5],
    },
  ],
};

describe('Chart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染图表容器', () => {
    render(<Chart options={mockOptions} height={400} />);
    
    const chartContainer = document.querySelector('div');
    expect(chartContainer).toBeInTheDocument();
    expect(chartContainer).toHaveStyle('height: 400px');
  });

  it('应该显示加载状态', () => {
    render(<Chart options={mockOptions} loading={true} />);
    
    const chartContainer = document.querySelector('div');
    expect(chartContainer).toBeInTheDocument();
  });

  it('应该处理空选项', () => {
    render(<Chart options={{}} />);
    
    const chartContainer = document.querySelector('div');
    expect(chartContainer).toBeInTheDocument();
  });

  it('应该使用默认高度', () => {
    render(<Chart options={mockOptions} />);
    
    const chartContainer = document.querySelector('div');
    expect(chartContainer).toHaveStyle('height: 400px');
  });
});