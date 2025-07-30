import { BaseDataSource } from './BaseDataSource';
import { ChartQueryParams, ChartData } from '../types';

export class MetricDataSource extends BaseDataSource {
  private apiEndpoint: string;
  private headers: Record<string, string>;

  constructor(apiEndpoint: string, headers: Record<string, string> = {}) {
    super();
    this.apiEndpoint = apiEndpoint;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  async fetchData(params: ChartQueryParams): Promise<ChartData> {
    if (!this.validateParams(params)) {
      throw new Error('Invalid query parameters');
    }

    try {
      const queryParams = new URLSearchParams({
        start: params.startTime.toString(),
        end: params.endTime.toString(),
        step: (params.step || 60).toString(),
        ...params.filters,
      });

      const response = await fetch(`${this.apiEndpoint}?${queryParams}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      return this.transformData(rawData, params);
    } catch (error) {
      console.error('Failed to fetch metric data:', error);
      throw error;
    }
  }

  private transformData(rawData: any, params: ChartQueryParams): ChartData {
    const series = this.parseMetricData(rawData.data?.result || []);
    const timestamps = this.generateTimestamps(
      params.startTime,
      params.endTime,
      params.step || 60,
    );

    return {
      series,
      timestamps,
      metadata: {
        query: rawData.query,
        resultType: rawData.data?.resultType,
        executionTime: rawData.executionTime,
      },
    };
  }

  private generateTimestamps(
    start: number,
    end: number,
    step: number,
  ): number[] {
    const timestamps: number[] = [];
    for (let time = start; time <= end; time += step) {
      timestamps.push(time * 1000);
    }
    return timestamps;
  }
}
