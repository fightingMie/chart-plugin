import React from 'react';

interface ChartQueryParams {
    startTime: number;
    endTime: number;
    step?: number;
    filters?: Record<string, any>;
}
interface ChartData {
    series: Array<{
        name: string;
        data: Array<[number, number]>;
        color?: string;
    }>;
    timestamps: number[];
    metadata?: Record<string, any>;
}
interface ChartDataSource {
    fetchData(params: ChartQueryParams): Promise<ChartData>;
    validateParams?(params: ChartQueryParams): boolean;
}
interface MetricChartPluginProps {
    dataSource: ChartDataSource;
    defaultTimeRange?: [number, number];
    defaultStep?: number;
    title?: string;
    height?: number;
    showControls?: boolean;
    onTimeRangeChange?: (startTime: number, endTime: number) => void;
    onStepChange?: (step: number) => void;
}
interface ChartProps {
    data: ChartData;
    height?: number;
    loading?: boolean;
    title?: string;
    showLegend?: boolean;
    showTooltip?: boolean;
}
interface DataType {
    key: string;
    time: string;
    [key: string]: any;
}
interface LineTableProps {
    data: DataType[];
    colorMap?: Record<string, string>;
    checkedItems?: string[];
    onItemCheck?: (item: string, checked: boolean) => void;
    height?: number;
}

declare const MetricChartPlugin: React.FC<MetricChartPluginProps>;

declare const Chart: React.FC<ChartProps>;

declare const LineTable: React.FC<LineTableProps>;

interface UseChartDataOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    onError?: (error: Error) => void;
}
declare function useChartData(dataSource: ChartDataSource, params: ChartQueryParams, options?: UseChartDataOptions): {
    data: ChartData | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};

declare abstract class BaseDataSource implements ChartDataSource {
    abstract fetchData(params: ChartQueryParams): Promise<ChartData>;
    validateParams(params: ChartQueryParams): boolean;
    protected formatTimestamp(timestamp: number): string;
    protected parseMetricData(rawData: any[]): ChartData['series'];
    private generateColor;
}

declare class MetricDataSource extends BaseDataSource {
    private apiEndpoint;
    private headers;
    constructor(apiEndpoint: string, headers?: Record<string, string>);
    fetchData(params: ChartQueryParams): Promise<ChartData>;
    private transformData;
    private generateTimestamps;
}

export { BaseDataSource, Chart, ChartData, ChartDataSource, ChartProps, ChartQueryParams, DataType, LineTable, LineTableProps, MetricChartPlugin, MetricChartPluginProps, MetricDataSource, useChartData };
