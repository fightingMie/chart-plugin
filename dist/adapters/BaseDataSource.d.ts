import { ChartDataSource, ChartQueryParams, ChartData } from '../types';
export declare abstract class BaseDataSource implements ChartDataSource {
    abstract fetchData(params: ChartQueryParams): Promise<ChartData>;
    validateParams(params: ChartQueryParams): boolean;
    protected formatTimestamp(timestamp: number): string;
    protected parseMetricData(rawData: any[]): ChartData['series'];
    private generateColor;
}
