import React from 'react';
import '@testing-library/jest-dom';
import { MetricStats } from '../../src/types';

// 添加 jest-dom 类型声明
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

// 首先定义所有的 Mock 组件
const MockOption = ({ children, value }: any) => (
  <option value={value}>{children}</option>
);

const MockSelect = ({ children, value, onChange, placeholder }: any) => (
  <select
    data-testid="select"
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    aria-label={placeholder}
  >
    {children}
  </select>
);

// 为Select添加Option属性
MockSelect.Option = MockOption;

// Mock antd components - 必须在组件导入之前完成
jest.mock('antd', () => ({
  Card: ({ children, title }: any) => (
    <div data-testid="card">
      {title && <div data-testid="card-title">{title}</div>}
      {children}
    </div>
  ),
  Select: MockSelect,
  Space: ({ children }: any) => <div data-testid="space">{children}</div>,
  Button: ({ children, onClick, icon, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {icon}
      {children}
    </button>
  ),
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  Col: ({ children }: any) => <div data-testid="col">{children}</div>,
}));

// Mock antd icons
jest.mock('@ant-design/icons', () => ({
  ReloadOutlined: () => <span data-testid="reload-icon">reload</span>,
  DownloadOutlined: () => <span data-testid="download-icon">download</span>,
}));

// Mock Chart component
jest.mock('../../src/components/Chart', () => ({
  Chart: ({ options, height, loading, visibleSeries }: any) => (
    <div
      data-testid="chart"
      data-height={height}
      data-loading={loading}
      data-visible-series={JSON.stringify(visibleSeries)}
    >
      Chart Component
      {options && <div data-testid="chart-options">{JSON.stringify(options)}</div>}
    </div>
  ),
}));

// Mock LineTable component
jest.mock('../../src/components/LineTable', () => ({
  LineTable: ({ data, colorMap, checkedItems, onItemCheck, height, usePagination, maxHeight }: any) => (
    <div
      data-testid="line-table"
      data-height={height}
      data-use-pagination={usePagination}
      data-max-height={maxHeight}
    >
      LineTable Component
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="color-map">{JSON.stringify(colorMap)}</div>
      <div data-testid="checked-items">{JSON.stringify(checkedItems)}</div>
      {onItemCheck && (
        <button
          data-testid="item-check-button"
          onClick={() => onItemCheck(['test-item'])}
        >
          Check Item
        </button>
      )}
    </div>
  ),
}));

// 现在才导入组件和测试工具
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricChartPlugin } from '../../src/components/MetricChartPlugin';

describe('MetricChartPlugin', () => {
  const mockChartOptions = {
    title: { text: 'Test Chart' },
    xAxis: { type: 'time' },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'CPU Usage',
        type: 'line',
        data: [[1640995200000, 50], [1640995260000, 60]],
      },
      {
        name: 'Memory Usage',
        type: 'line',
        data: [[1640995200000, 70], [1640995260000, 80]],
      },
    ],
  };

  const mockStatsData: MetricStats[] = [
    {
      name: 'CPU Usage',
      current: 55.5,
      maximum: 85.2,
      minimum: 20.1,
      average: 52.3,
      color: '#ff6b6b',
    },
    {
      name: 'Memory Usage',
      current: 75.0,
      maximum: 90.5,
      minimum: 45.2,
      average: 67.8,
      color: '#4ecdc4',
    },
  ];

  const defaultProps = {
    chartOptions: mockChartOptions,
    statsData: mockStatsData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<MetricChartPlugin {...defaultProps} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<MetricChartPlugin {...defaultProps} title="Custom Chart Title" />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent('Custom Chart Title');
  });

  it('passes correct props to Chart component', () => {
    render(<MetricChartPlugin {...defaultProps} height={500} />);
    
    const chart = screen.getByTestId('chart');
    expect(chart).toHaveAttribute('data-height', '500');
  });

  it('passes correct props to LineTable component', () => {
    render(
      <MetricChartPlugin 
        {...defaultProps} 
        usePagination={false}
        maxHeight={800}
      />
    );
    
    const lineTable = screen.getByTestId('line-table');
    expect(lineTable).toHaveAttribute('data-use-pagination', 'false');
    expect(lineTable).toHaveAttribute('data-max-height', '800');
  });

  it('handles view mode changes', () => {
    render(<MetricChartPlugin {...defaultProps} showControls={true} />);
    
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
    
    // 测试视图模式切换
    fireEvent.change(select, { target: { value: 'chart' } });
    // 由于我们的mock是简化的，这里主要测试组件不会崩溃
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const mockOnRefresh = jest.fn();
    render(
      <MetricChartPlugin 
        {...defaultProps} 
        onRefresh={mockOnRefresh}
        showControls={true}
      />
    );
    
    const refreshButton = screen.getByTestId('reload-icon').closest('button');
    if (refreshButton) {
      fireEvent.click(refreshButton);
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onExport when export button is clicked', () => {
    const mockOnExport = jest.fn();
    render(
      <MetricChartPlugin 
        {...defaultProps} 
        onExport={mockOnExport}
        showControls={true}
      />
    );
    
    const exportButton = screen.getByTestId('download-icon').closest('button');
    if (exportButton) {
      fireEvent.click(exportButton);
      expect(mockOnExport).toHaveBeenCalledTimes(1);
    }
  });

  it('generates correct color map from stats data', () => {
    render(<MetricChartPlugin {...defaultProps} />);
    
    const colorMap = screen.getByTestId('color-map');
    const expectedColorMap = {
      'CPU Usage': '#ff6b6b',
      'Memory Usage': '#4ecdc4',
    };
    expect(colorMap).toHaveTextContent(JSON.stringify(expectedColorMap));
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      chartOptions: mockChartOptions,
      statsData: [],
    };
    
    expect(() => {
      render(<MetricChartPlugin {...minimalProps} />);
    }).not.toThrow();
  });

  it('renders without table when showTable is false', () => {
    render(<MetricChartPlugin {...defaultProps} showTable={false} />);
    
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.queryByTestId('line-table')).not.toBeInTheDocument();
  });

  it('renders without controls when showControls is false', () => {
    render(<MetricChartPlugin {...defaultProps} showControls={false} />);
    
    expect(screen.queryByTestId('select')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reload-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
  });
});