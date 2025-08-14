import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react'; // 使用 React 19 的 act
import { useChartData } from '../../src/hooks/useChartData';
import { BaseDataSource } from '../../src/adapters/BaseDataSource';
import { ChartQueryParams, ChartData } from '../../src/types';

class MockDataSource extends BaseDataSource {
  private shouldFail: boolean;
  
  constructor(shouldFail = false) {
    super();
    this.shouldFail = shouldFail;
  }
  
  async fetchData(): Promise<ChartData> {
    if (this.shouldFail) {
      throw new Error('Mock error');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      series: [
        {
          name: 'Test',
          data: [[Date.now(), 42]]
        }
      ],
      timestamps: [Math.floor(Date.now() / 1000)],
      metadata: {}
    };
  }
}

describe('useChartData', () => {
  it('应该成功获取数据', async () => {
    const dataSource = new MockDataSource();
    const params = {
      startTime: Math.floor(Date.now() / 1000) - 3600,
      endTime: Math.floor(Date.now() / 1000),
      step: 60
    };
    
    const { result } = renderHook(() => useChartData(dataSource, params));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeTruthy();
    expect(result.current.data?.series).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });
  
  it('应该处理错误', async () => {
    const dataSource = new MockDataSource(true);
    const params = {
      startTime: Math.floor(Date.now() / 1000) - 3600,
      endTime: Math.floor(Date.now() / 1000),
      step: 60
    };
    
    const { result } = renderHook(() => useChartData(dataSource, params));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Mock error');
  });
  
  it('应该支持重新获取数据', async () => {
    const dataSource = new MockDataSource();
    const params: ChartQueryParams = {
      startTime: Math.floor(Date.now() / 1000) - 3600,
      endTime: Math.floor(Date.now() / 1000),
      step: 60
    };
    
    const { result } = renderHook(() => useChartData(dataSource, params));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeTruthy();
    
    // 使用 act 包裹状态更新
    await act(async () => {
      result.current.refetch();
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeTruthy();
  });
});