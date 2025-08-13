import React, { useState, useMemo } from 'react';
import {
  Card,
  Select,
  Space,
  Button,
  Row,
  Col,
  Alert,
} from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Chart } from './Chart';
import { LineTable } from './LineTable';
import { MetricChartPluginProps, DataType, MetricStats } from '../types';

const { Option } = Select;

export const MetricChartPlugin: React.FC<MetricChartPluginProps> = ({
  chartOptions,
  statsData = [],
  title = '指标图表',
  height = 400,
  showControls = true,
  showTable = true,
  usePagination = true,
  maxHeight = 600,
  onExport,
  onRefresh,
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'both'>('both');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 将统计数据转换为表格数据
  const tableData = useMemo((): DataType[] => {
    return statsData.map((stat: MetricStats) => ({
      key: stat.name,
      name: stat.name,
      current: stat.current?.toFixed(2) || '-',
      maximum: stat.maximum?.toFixed(2) || '-',
      minimum: stat.minimum?.toFixed(2) || '-',
      average: stat.average?.toFixed(2) || '-',
    }));
  }, [statsData]);

  // 生成颜色映射
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    statsData.forEach((stat: MetricStats) => {
      if (stat.color) {
        map[stat.name] = stat.color;
      }
    });
    return map;
  }, [statsData]);

  const handleItemCheck = (selectedRowKeys: string[]) => {
    setCheckedItems(selectedRowKeys);
  };

  const handleExport = () => {
    if (!tableData.length) return;

    if (onExport) {
      onExport(statsData);
    } else {
      // 默认导出CSV
      const csvContent = [
        Object.keys(tableData[0]).join(','),
        ...tableData.map((row) => Object.values(row).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `metric-data-${Date.now()}.csv`;
      link.click();
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true);
      try {
        await onRefresh();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card title={title} style={{ width: '100%' }}>
      {showControls && (
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Space>
                <span>视图:</span>
                <Select
                  value={viewMode}
                  onChange={setViewMode}
                  style={{ width: 120 }}
                >
                  <Option value="chart">仅图表</Option>
                  {showTable && <Option value="table">仅表格</Option>}
                  {showTable && <Option value="both">图表+表格</Option>}
                </Select>
              </Space>
            </Col>
            <Col>
              <Space>
                {onRefresh && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading}
                  >
                    刷新
                  </Button>
                )}
                {showTable && (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={!tableData.length}
                  >
                    导出
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      )}

      {(viewMode === 'chart' || viewMode === 'both') && (
        <div style={{ marginBottom: viewMode === 'both' ? 24 : 0 }}>
          <Chart
            options={chartOptions}
            height={height}
            loading={loading}
            visibleSeries={checkedItems}
          />
        </div>
      )}

      {showTable && (viewMode === 'table' || viewMode === 'both') && (
        <LineTable
          data={tableData}
          colorMap={colorMap}
          height={viewMode === 'table' ? height : 300}
          onItemCheck={handleItemCheck}
          checkedItems={checkedItems}
          usePagination={usePagination}
          maxHeight={maxHeight}
        />
      )}
    </Card>
  );
};
