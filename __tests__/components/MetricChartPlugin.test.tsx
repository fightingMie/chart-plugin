import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricChartPlugin } from '../../src/components/MetricChartPlugin';
import { BaseDataSource } from '../../src/adapters/BaseDataSource';
import { ChartQueryParams, ChartData } from '../../src/types';

// Mock antd components
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  DatePicker: {
    RangePicker: ({ onChange, value }: any) => (
      <input
        data-testid="range-picker"
        onChange={(e) => onChange && onChange([new Date(e.target.value), new Date()])}
      />
    )
  },
  Select: ({ children, onChange, value }: any) => (
    <select data-testid="select" onChange={(e) => onChange && onChange(e.target.value)} value={value}>
      {children}
    </select>
  ),
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  )
}));

// Mock Chart component
jest.mock('../../src/components/Chart', () => ({
  Chart: ({ data, loading }: any) => (
    <div data-testid="chart">
      {loading ? 'Loading...' : `Chart with ${data?.series?.length || 0} series`}
    </div>
  )
}));

// Mock LineTable component
jest.mock('../../src/components/LineTable', () => ({
  LineTable: ({ data }: any) => (
    <div data-testid="line-table">
      Table with {data?.length || 0} rows
    </div>
  )
}));

class MockDataSource extends BaseDataSource {
  async fetchData(params: ChartQueryParams): Promise<ChartData> {
    return {
      series: [
        {
          name: 'Test Metric',
          data: [[Date.now(), 50]]
        }
      ],
      timestamps: [Math.floor(Date.now() / 1000)],
      metadata: {}
    };
  }
}

describe('MetricChartPlugin', () => {
  let mockDataSource: MockDataSource;
  
  beforeEach(() => {
    mockDataSource = new MockDataSource();
  });
  
  it('应该正确渲染组件', async () => {
    render(
      <MetricChartPlugin
        dataSource={mockDataSource}
        title="测试图表"
      />
    );
    
    expect(screen.getByText('测试图表')).toBeTruthy();
    
    await waitFor(() => {
      expect(screen.getByTestId('chart')).toBeTruthy();
    });
  });
  
  it('应该显示加载状态', () => {
    render(
      <MetricChartPlugin
        dataSource={mockDataSource}
        title="测试图表"
      />
    );
    
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
  
  it('应该处理时间范围变更', async () => {
    const onTimeRangeChange = jest.fn();
    
    render(
      <MetricChartPlugin
        dataSource={mockDataSource}
        onTimeRangeChange={onTimeRangeChange}
      />
    );
    
    const rangePicker = screen.getByTestId('range-picker');
    fireEvent.change(rangePicker, { target: { value: '2023-01-01' } });
    
    await waitFor(() => {
      expect(onTimeRangeChange).toHaveBeenCalled();
    });
  });
  
  it('应该处理步长变更', async () => {
    const onStepChange = jest.fn();
    
    render(
      <MetricChartPlugin
        dataSource={mockDataSource}
        onStepChange={onStepChange}
        showControls={true}
      />
    );
    
    const select = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: '300' } });
    
    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith(300);
    });
  });
  
  it('应该隐藏控制器当showControls为false', () => {
    render(
      <MetricChartPlugin
        dataSource={mockDataSource}
        showControls={false}
      />
    );
    
    expect(screen.queryByTestId('range-picker')).not.toBeTruthy();
  });
});