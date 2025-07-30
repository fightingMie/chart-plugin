import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { LineTableProps, DataType } from '../types';

const StyledTable = styled(Table)`
  .ant-table-cell {
    padding: 8px 12px !important;

    .cell-content {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .highlight {
    background-color: #fff2e8;
    padding: 0 2px;
  }
`;

export const LineTable: React.FC<LineTableProps> = ({
  data,
  colorMap = {},
  checkedItems = [],
  onItemCheck,
  height = 400,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchColumn, setSearchColumn] = useState<string>('');

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys)
      .filter((key) => key !== 'key')
      .map((key) => ({
        title: key,
        dataIndex: key,
        key,
        width: key === 'time' ? 180 : 150,
        render: (text: any, record: DataType) => {
          const displayText = String(text || '');
          const highlighted =
            searchText && searchColumn === key
              ? displayText.replace(
                  new RegExp(`(${searchText})`, 'gi'),
                  '<span class="highlight">$1</span>',
                )
              : displayText;

          return (
            <div
              className="cell-content"
              style={{
                color: colorMap[key] || '#000',
                fontWeight: checkedItems.includes(key) ? 'bold' : 'normal',
              }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
              title={displayText}
            />
          );
        },
        sorter: (a: DataType, b: DataType) => {
          const aVal = String(a[key] || '');
          const bVal = String(b[key] || '');
          return aVal.localeCompare(bVal);
        },
      }));
  }, [data, searchText, searchColumn, colorMap, checkedItems]);

  const filteredData = useMemo(() => {
    if (!searchText || !searchColumn) return data;

    return data.filter((item) => {
      const value = String(item[searchColumn] || '').toLowerCase();
      return value.includes(searchText.toLowerCase());
    });
  }, [data, searchText, searchColumn]);

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <Input.Search
          placeholder={
            searchColumn ? `在 ${searchColumn} 列中搜索...` : '请先选择搜索列'
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => setSearchText(value)}
          disabled={!searchColumn}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Space>
          {columns.map((col) => (
            <Button
              key={col.key}
              size="small"
              type={searchColumn === col.key ? 'primary' : 'default'}
              onClick={() => {
                setSearchColumn(col.key as string);
                setSearchText('');
              }}
            >
              {col.title}
            </Button>
          ))}
          {searchColumn && (
            <Button
              size="small"
              onClick={() => {
                setSearchText('');
                setSearchColumn('');
              }}
            >
              清除
            </Button>
          )}
        </Space>
      </div>

      <StyledTable
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 50,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ y: height - 100, x: 'max-content' }}
        size="small"
        bordered
      />
    </div>
  );
};
