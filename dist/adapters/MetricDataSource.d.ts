import { BaseDataSource } from './BaseDataSource';
import { ChartQueryParams, ChartData } from '../types';
export declare class MetricDataSource extends BaseDataSource {
    private apiEndpoint;
    private headers;
    constructor(apiEndpoint: string, headers?: Record<string, string>);
    fetchData(params: ChartQueryParams): Promise<ChartData>;
    private transformData;
    private generateTimestamps;
}
