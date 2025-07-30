import { useState, useEffect, useCallback, useRef } from 'react';
import { ChartDataSource, ChartQueryParams, ChartData } from '../types';

export interface UseChartDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

export function useChartData(
  dataSource: ChartDataSource,
  params: ChartQueryParams,
  options: UseChartDataOptions = {},
) {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 使用 ref 来存储 options，避免依赖数组问题
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    if (!dataSource || !params) return;

    setLoading(true);
    setError(null);

    try {
      const result = await dataSource.fetchData(params);
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      optionsRef.current.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [dataSource, params]); // 移除 options 依赖

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (optionsRef.current.autoRefresh && optionsRef.current.refreshInterval) {
      const interval = setInterval(fetchData, optionsRef.current.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options.autoRefresh, options.refreshInterval]); // 保留这些基本类型的依赖

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
