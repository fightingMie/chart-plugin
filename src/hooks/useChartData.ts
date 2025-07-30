import { useState, useEffect, useCallback } from 'react';
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
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [dataSource, params, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (options.autoRefresh && options.refreshInterval) {
      const interval = setInterval(fetchData, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options.autoRefresh, options.refreshInterval]);

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
