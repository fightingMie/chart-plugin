export interface ChartQueryParams {
    startTime: number;
    endTime: number;
    step?: number;
    filters?: Record<string, any>;
}
export interface ChartData {
    series: Array<{
        name: string;
        data: Array<[number, number]>;
        color?: string;
    }>;
    timestamps: number[];
    metadata?: Record<string, any>;
}
export interface ChartDataSource {
    fetchData(params: ChartQueryParams): Promise<ChartData>;
    validateParams?(params: ChartQueryParams): boolean;
}
export interface MetricStats {
    name: string;
    current?: number;
    maximum?: number;
    minimum?: number;
    average?: number;
    color?: string;
}
export interface MetricChartPluginProps {
    chartOptions: any;
    statsData?: MetricStats[];
    title?: string;
    height?: number;
    showControls?: boolean;
    showTable?: boolean;
    usePagination?: boolean;
    maxHeight?: number;
    onExport?: (data: MetricStats[]) => void;
    onRefresh?: () => void;
}
export interface ChartProps {
    options: any;
    height?: number;
    loading?: boolean;
    visibleSeries?: string[];
}
export interface DataType {
    key: string;
    name: string;
    current?: string;
    maximum?: string;
    minimum?: string;
    average?: string;
    [key: string]: any;
}
export interface LineTableProps {
    data: DataType[];
    colorMap?: Record<string, string>;
    checkedItems?: string[];
    onItemCheck?: (values: string[]) => void;
    height?: number;
    usePagination?: boolean;
    maxHeight?: number;
}
