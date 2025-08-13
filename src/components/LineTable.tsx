import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Space } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { LineTableProps, DataType } from '../types';

type ColumnType<T> = NonNullable<TableProps<T>['columns']>[0];

interface FilterDropdownProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters?: () => void;
}

const TableContainer = styled.div`
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

  .color-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 8px;
    vertical-align: middle;
  }
`;

export const LineTable: React.FC<LineTableProps> = ({
  data,
  colorMap = {},
  checkedItems = [],
  onItemCheck,
  height = 400,
  usePagination = true, // 默认使用分页
  maxHeight = 600, // 默认最大高度
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('');

  const columns = useMemo((): ColumnType<DataType>[] => {
    if (!data || data.length === 0) return [];

    const allKeys = new Set<string>();
    data.forEach((item: DataType) => {
      Object.keys(item).forEach((key: string) => allKeys.add(key));
    });

    return Array.from(allKeys)
      .filter((key: string) => key !== 'key' && key !== 'time') // 过滤掉time列
      .map((key: string): ColumnType<DataType> => {
        const isNameColumn = key === 'name';
        const isNumericColumn = ['current', 'average', 'maximum', 'minimum'].includes(key);
        const isSearchableColumn = isNameColumn; // 只有name列支持搜索
        
        return {
          title: key === 'name' ? '系列名称' :
                 key === 'current' ? '当前值' : 
                 key === 'average' ? '平均值' :
                 key === 'maximum' ? '最大值' :
                 key === 'minimum' ? '最小值' : key,
          dataIndex: key,
          key,
          width: isNameColumn ? 200 : 120,
          // 只有非系列名称列支持排序
          sorter: !isNameColumn ? (
            isNumericColumn ? {
              compare: (a: DataType, b: DataType) => {
                const aVal = parseFloat(a[key]) || 0;
                const bVal = parseFloat(b[key]) || 0;
                return aVal - bVal;
              },
              multiple: 1,
            } : {
              compare: (a: DataType, b: DataType) => {
                const aStr = a[key]?.toString() || '';
                const bStr = b[key]?.toString() || '';
                return aStr.localeCompare(bStr);
              },
              multiple: 2,
            }
          ) : undefined,
          render: (text: any, record: DataType): React.ReactNode => {
            const displayText: string = text?.toString() || '';
            const hasValidSearch: boolean = searchColumn === key && Boolean(searchText?.trim());
            const isHighlighted: boolean = hasValidSearch && displayText.toLowerCase().includes(searchText.toLowerCase());
            
            if (isNameColumn) {
              const color: string = colorMap[record.name] || '#1890ff';
              return (
                <div className="cell-content" style={{ display: 'flex', alignItems: 'center' }}>
                  <span 
                    className="color-indicator" 
                    style={{ backgroundColor: color }}
                  />
                  {isHighlighted ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: displayText.replace(
                          new RegExp(searchText, 'gi'),
                          (match: string) => `<span class="highlight">${match}</span>`
                        ),
                      }}
                    />
                  ) : (
                    displayText
                  )}
                </div>
              );
            }

            return (
              <div className="cell-content">
                {isHighlighted ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: displayText.replace(
                        new RegExp(searchText, 'gi'),
                        (match: string) => `<span class="highlight">${match}</span>`
                      ),
                    }}
                  />
                ) : (
                  displayText
                )}
              </div>
            );
          },
          // 只有系列名称列支持搜索
          filterDropdown: isSearchableColumn ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps): React.ReactNode => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={`搜索 ${key === 'name' ? '系列名称' : key}`}
                value={selectedKeys[0] as string}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => {
                  confirm();
                  setSearchText(selectedKeys[0] as string);
                  setSearchColumn(key);
                }}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    confirm();
                    setSearchText(selectedKeys[0] as string);
                    setSearchColumn(key);
                  }}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  搜索
                </Button>
                <Button
                  onClick={() => {
                    clearFilters && clearFilters();
                    setSearchText('');
                    setSearchColumn('');
                  }}
                  size="small"
                  style={{ width: 90 }}
                >
                  重置
                </Button>
              </Space>
            </div>
          ) : undefined,
          filterIcon: isSearchableColumn ? (filtered: boolean): React.ReactNode => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          ) : undefined,
        };
      });
  }, [data, colorMap, searchText, searchColumn]);

  const filteredData = useMemo((): DataType[] => {
    if (!searchText || !searchColumn) return data;
    return data.filter((item: DataType) => {
      const value: any = item[searchColumn];
      return value?.toString().toLowerCase().includes(searchText.toLowerCase());
    });
  }, [data, searchText, searchColumn]);

  // 计算表格滚动配置
  const scrollConfig = useMemo(() => {
    if (usePagination) {
      // 使用分页时的滚动配置
      return { y: height - 100, x: 'max-content' };
    } else {
      // 不使用分页时，设置最大高度并允许滚动
      return { y: maxHeight - 150, x: 'max-content' };
    }
  }, [usePagination, height, maxHeight]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="全局搜索..."
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          {searchText && (
            <Button
              onClick={() => {
                setSearchText('');
                setSearchColumn('');
              }}
            >
              清除搜索
            </Button>
          )}
        </Space>
      </div>

      <TableContainer>
        <Table<DataType>
          columns={columns}
          dataSource={filteredData}
          pagination={usePagination ? {
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条记录`,
          } : false} // 根据usePagination控制分页
          scroll={scrollConfig}
          size="small"
          bordered
          rowSelection={{
            selectedRowKeys: checkedItems,
            onChange: (
              selectedRowKeys: React.Key[],
              selectedRows: DataType[],
            ) => {
              onItemCheck && onItemCheck(selectedRows.map((item: DataType) => item.name));
            },
            getCheckboxProps: (record: DataType) => ({
              name: record.name,
            }),
          }}
        />
      </TableContainer>
    </div>
  );
};
