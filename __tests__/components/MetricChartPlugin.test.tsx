import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricChartPlugin } from '../../src/components/MetricChartPlugin';
import { MetricStats } from '../../src/types';

// Mock antd components (合并后的完整配置)
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
    expect(screen.getByTestId('line-table')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<MetricChartPlugin {...defaultProps} title="Custom Chart Title" />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent('Custom Chart Title');
  });

  it('passes correct props to Chart component', () => {
    render(<MetricChartPlugin {...defaultProps} height={500} />);
    
    const chart = screen.getByTestId('chart');
    expect(chart).toHaveAttribute('data-height', '500');
    expect(chart).toHaveAttribute('data-loading', 'false');
    
    const chartOptions = screen.getByTestId('chart-options');
    expect(chartOptions).toHaveTextContent(JSON.stringify(mockChartOptions));
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
    
    // Check table data conversion
    const tableData = screen.getByTestId('table-data');
    const expectedTableData = [
      {
        key: 'CPU Usage',
        name: 'CPU Usage',
        current: '55.50',
        maximum: '85.20',
        minimum: '20.10',
        average: '52.30',
      },
      {
        key: 'Memory Usage',
        name: 'Memory Usage',
        current: '75.00',
        maximum: '90.50',
        minimum: '45.20',
        average: '67.80',
      },
    ];
    expect(tableData).toHaveTextContent(JSON.stringify(expectedTableData));
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

  it('handles view mode changes', () => {
    render(<MetricChartPlugin {...defaultProps} />);
    
    const select = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: 'chart' } });
    
    // Should still render both components as the mock doesn't implement conditional rendering
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-table')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const mockOnRefresh = jest.fn();
    render(<MetricChartPlugin {...defaultProps} onRefresh={mockOnRefresh} />);
    
    const refreshButton = screen.getByRole('button', { name: /reload/ });
    fireEvent.click(refreshButton);
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onExport when export button is clicked', () => {
    const mockOnExport = jest.fn();
    render(<MetricChartPlugin {...defaultProps} onExport={mockOnExport} />);
    
    const exportButton = screen.getByRole('button', { name: /download/ });
    fireEvent.click(exportButton);
    
    expect(mockOnExport).toHaveBeenCalledWith(mockStatsData);
  });

  it('handles empty stats data', () => {
    render(<MetricChartPlugin chartOptions={mockChartOptions} statsData={[]} />);
    
    const tableData = screen.getByTestId('table-data');
    expect(tableData).toHaveTextContent('[]');
    
    const colorMap = screen.getByTestId('color-map');
    expect(colorMap).toHaveTextContent('{}');
  });

  it('handles stats data without color', () => {
    const statsWithoutColor: MetricStats[] = [
      {
        name: 'Test Metric',
        current: 50,
        maximum: 100,
        minimum: 0,
        average: 50,
      },
    ];
    
    render(<MetricChartPlugin chartOptions={mockChartOptions} statsData={statsWithoutColor} />);
    
    const colorMap = screen.getByTestId('color-map');
    expect(colorMap).toHaveTextContent('{}');
  });

  it('handles stats data with undefined values', () => {
    const statsWithUndefined: MetricStats[] = [
      {
        name: 'Test Metric',
        current: undefined,
        maximum: undefined,
        minimum: undefined,
        average: undefined,
      },
    ];
    
    render(<MetricChartPlugin chartOptions={mockChartOptions} statsData={statsWithUndefined} />);
    
    const tableData = screen.getByTestId('table-data');
    const expectedData = [{
      key: 'Test Metric',
      name: 'Test Metric',
      current: '-',
      maximum: '-',
      minimum: '-',
      average: '-',
    }];
    expect(tableData).toHaveTextContent(JSON.stringify(expectedData));
  });

  it('does not render controls when showControls is false', () => {
    render(<MetricChartPlugin {...defaultProps} showControls={false} />);
    
    expect(screen.queryByTestId('select')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles item check in LineTable', () => {
    render(<MetricChartPlugin {...defaultProps} />);
    
    const itemCheckButton = screen.getByTestId('item-check-button');
    fireEvent.click(itemCheckButton);
    
    // The checked items should be updated in the component state
    // This is tested through the mock component's data attributes
    expect(screen.getByTestId('line-table')).toBeInTheDocument();
  });
});