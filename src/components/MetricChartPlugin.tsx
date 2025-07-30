import React, { useState, useMemo } from 'react';
import {
  Card,
  DatePicker,
  Select,
  Space,
  Button,
  Row,
  Col,
  Spin,
  Alert,
} from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment'; // 4.x 使用 moment
import { Chart } from './Chart';
import { LineTable } from './LineTable';
import { useChartData } from '../hooks/useChartData';
import { MetricChartPluginProps, DataType } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const MetricChartPlugin: React.FC<MetricChartPluginProps> = ({
  dataSource,
  defaultTimeRange,
  defaultStep = 60,
  title = '指标图表',
  height = 400,
  showControls = true,
  onTimeRangeChange,
  onStepChange,
}) => {
  const [timeRange, setTimeRange] = useState<[number, number]>(
    defaultTimeRange || [Date.now() - 3600000, Date.now()],
  );
  const [step, setStep] = useState(defaultStep);
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'both'>('both');

  const queryParams = useMemo(
    () => ({
      startTime: Math.floor(timeRange[0] / 1000),
      endTime: Math.floor(timeRange[1] / 1000),
      step,
    }),
    [timeRange, step],
  );

  const { data, loading, error, refetch } = useChartData(
    dataSource,
    queryParams,
    {
      onError: (err) => {
        console.error('Chart data fetch error:', err);
      },
    },
  );

  const tableData = useMemo((): DataType[] => {
    if (!data || !data.series.length) return [];

    const result: DataType[] = [];
    const maxLength = Math.max(...data.series.map((s) => s.data.length));

    for (let i = 0; i < maxLength; i++) {
      const row: DataType = {
        key: `row-${i}`,
        time: data.timestamps[i]
          ? new Date(data.timestamps[i]).toLocaleString()
          : '',
      };

      data.series.forEach((series) => {
        if (series.data[i]) {
          row[series.name] = series.data[i][1];
        }
      });

      result.push(row);
    }

    return result;
  }, [data]);

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    data?.series.forEach((series) => {
      if (series.color) {
        map[series.name] = series.color;
      }
    });
    return map;
  }, [data]);

  // 兼容 Ant Design 4.x 的时间处理
  const handleTimeRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const newRange: [number, number] = [
        dates[0].valueOf(),
        dates[1].valueOf(),
      ];
      setTimeRange(newRange);
      onTimeRangeChange?.(
        Math.floor(newRange[0] / 1000),
        Math.floor(newRange[1] / 1000),
      );
    }
  };

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const handleExport = () => {
    if (!tableData.length) return;

    const csvContent = [
      Object.keys(tableData[0]).join(','),
      ...tableData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `metric-data-${Date.now()}.csv`;
    link.click();
  };

  const stepOptions = [
    { label: '15秒', value: 15 },
    { label: '30秒', value: 30 },
    { label: '1分钟', value: 60 },
    { label: '5分钟', value: 300 },
    { label: '15分钟', value: 900 },
    { label: '30分钟', value: 1800 },
    { label: '1小时', value: 3600 },
  ];

  return (
    <Card title={title} style={{ width: '100%' }}>
      {showControls && (
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Space>
                <span>时间范围:</span>
                <RangePicker
                  value={[moment(timeRange[0]), moment(timeRange[1])]}
                  onChange={handleTimeRangeChange}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Space>
            </Col>
            <Col>
              <Space>
                <span>步长:</span>
                <Select
                  value={step}
                  onChange={handleStepChange}
                  style={{ width: 100 }}
                >
                  {stepOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col>
              <Space>
                <span>视图:</span>
                <Select
                  value={viewMode}
                  onChange={setViewMode}
                  style={{ width: 120 }}
                >
                  <Option value="chart">仅图表</Option>
                  <Option value="table">仅表格</Option>
                  <Option value="both">图表+表格</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={refetch}
                  loading={loading}
                >
                  刷新
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={!tableData.length}
                >
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      )}

      {error && (
        <Alert
          message="数据加载失败"
          description={error.message}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={loading}>
        {(viewMode === 'chart' || viewMode === 'both') && (
          <div style={{ marginBottom: viewMode === 'both' ? 24 : 0 }}>
            <Chart
              data={data}
              height={height}
              loading={loading}
              showLegend
              showTooltip
            />
          </div>
        )}

        {(viewMode === 'table' || viewMode === 'both') && (
          <LineTable
            data={tableData}
            colorMap={colorMap}
            height={viewMode === 'table' ? height : 300}
          />
        )}
      </Spin>
    </Card>
  );
};
