import { ChartDataSource, ChartQueryParams, ChartData } from '../types';

export abstract class BaseDataSource implements ChartDataSource {
  abstract fetchData(params: ChartQueryParams): Promise<ChartData>;

  validateParams(params: ChartQueryParams): boolean {
    if (!params.startTime || !params.endTime) {
      return false;
    }
    if (params.startTime >= params.endTime) {
      return false;
    }
    return true;
  }

  protected formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toISOString();
  }

  protected parseMetricData(rawData: any[]): ChartData['series'] {
    return rawData.map((item, index) => ({
      name: item.metric?.name || `Series ${index + 1}`,
      data:
        item.values?.map(([time, value]: [number, string]) => [
          time * 1000,
          parseFloat(value),
        ]) || [],
      color: this.generateColor(index),
    }));
  }

  private generateColor(index: number): string {
    const colors = [
      '#1890ff',
      '#52c41a',
      '#faad14',
      '#f5222d',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
      '#fa8c16',
    ];
    return colors[index % colors.length];
  }
}
