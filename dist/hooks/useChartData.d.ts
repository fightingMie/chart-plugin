import { ChartDataSource, ChartQueryParams, ChartData } from '../types';
export interface UseChartDataOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    onError?: (error: Error) => void;
}
export declare function useChartData(dataSource: ChartDataSource, params: ChartQueryParams, options?: UseChartDataOptions): {
    data: ChartData | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};
