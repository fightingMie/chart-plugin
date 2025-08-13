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

// 新增：统计数据接口
export interface MetricStats {
  name: string;
  current?: number;
  maximum?: number;
  minimum?: number;
  average?: number;
  color?: string;
}

// 修改：MetricChartPlugin的Props接口
export interface MetricChartPluginProps {
  // ECharts配置选项
  chartOptions: any; // ECharts的option对象
  // 统计数据（用于表格显示）
  statsData?: MetricStats[];
  // 基础配置
  title?: string;
  height?: number;
  showControls?: boolean;
  // 表格配置
  showTable?: boolean;
  usePagination?: boolean;
  maxHeight?: number;
  // 事件回调
  onExport?: (data: MetricStats[]) => void;
  onRefresh?: () => void;
}

// 简化ChartProps接口
export interface ChartProps {
  options: any; // 直接接收ECharts options
  height?: number;
  loading?: boolean;
  visibleSeries?: string[]; // 控制显示的系列
}

// 保持DataType接口用于表格
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

// 移除不再需要的接口
// export interface ChartQueryParams { ... }
// export interface ChartData { ... }
// export interface ChartDataSource { ... }
