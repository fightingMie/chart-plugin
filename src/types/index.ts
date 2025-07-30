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

export interface MetricChartPluginProps {
  dataSource: ChartDataSource;
  defaultTimeRange?: [number, number];
  defaultStep?: number;
  title?: string;
  height?: number;
  showControls?: boolean;
  onTimeRangeChange?: (startTime: number, endTime: number) => void;
  onStepChange?: (step: number) => void;
}

export interface ChartProps {
  data: ChartData;
  height?: number;
  loading?: boolean;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface DataType {
  key: string;
  time: string;
  [key: string]: any;
}

export interface LineTableProps {
  data: DataType[];
  colorMap?: Record<string, string>;
  checkedItems?: string[];
  onItemCheck?: (item: string, checked: boolean) => void;
  height?: number;
}
