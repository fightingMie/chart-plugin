// Ant Design 版本兼容性工具
import type { Moment } from 'moment';
import type { Dayjs } from 'dayjs';

// 版本检测
export const getAntdVersion = (): '4' | '5' => {
  try {
    const antd = require('antd/package.json');
    return antd.version.startsWith('4') ? '4' : '5';
  } catch {
    return '5'; // 默认假设为 5.x
  }
};

export const isAntd4 = () => getAntdVersion() === '4';
export const isAntd5 = () => getAntdVersion() === '5';

// 时间处理兼容
export const createMoment = (date?: number | Date | string | Moment | Dayjs): Moment | Dayjs => {
  if (isAntd4()) {
    const moment = require('moment');
    return moment(date);
  } else {
    const dayjs = require('dayjs');
    return dayjs(date);
  }
};

// 时间格式化兼容
export const formatDate = (date: number | Date | string | Moment | Dayjs, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const momentOrDayjs = createMoment(date);
  return momentOrDayjs.format(format);
};

// 获取当前时间
export const now = (): Moment | Dayjs => {
  return createMoment();
};

// 时间比较
export const isBefore = (date1: number | Date | string | Moment | Dayjs, date2: number | Date | string | Moment | Dayjs): boolean => {
  const moment1 = createMoment(date1);
  const moment2 = createMoment(date2);
  return moment1.isBefore(moment2 as any);
};

export const isAfter = (date1: number | Date | string | Moment | Dayjs, date2: number | Date | string | Moment | Dayjs): boolean => {
  const moment1 = createMoment(date1);
  const moment2 = createMoment(date2);
  // 由于 moment 和 dayjs 的类型定义不完全兼容，需要进行类型转换
  return moment1.isAfter(moment2 as any);
};

// 时间计算
export const addTime = (date: number | Date | string | Moment | Dayjs, amount: number, unit: 'day' | 'hour' | 'minute' | 'second' = 'day'): Moment | Dayjs => {
  const momentOrDayjs = createMoment(date);
  return momentOrDayjs.add(amount, unit);
};

export const subtractTime = (date: number | Date | string | Moment | Dayjs, amount: number, unit: 'day' | 'hour' | 'minute' | 'second' = 'day'): Moment | Dayjs => {
  const momentOrDayjs = createMoment(date);
  return momentOrDayjs.subtract(amount, unit);
};

// 获取时间戳
export const getTimestamp = (date?: number | Date | string | Moment | Dayjs): number => {
  const momentOrDayjs = createMoment(date);
  return momentOrDayjs.valueOf();
};

// 获取 Unix 时间戳（秒）
export const getUnixTimestamp = (date?: number | Date | string | Moment | Dayjs): number => {
  const momentOrDayjs = createMoment(date);
  return momentOrDayjs.unix();
};

// 时间范围计算
export const getTimeRange = (type: 'today' | 'yesterday' | 'week' | 'month' | 'year'): { start: Moment | Dayjs; end: Moment | Dayjs } => {
  const current = now();
  
  switch (type) {
    case 'today':
      return {
        start: current.startOf('day'),
        end: current.endOf('day')
      };
    case 'yesterday': {
      const yesterday = subtractTime(current, 1, 'day');
      return {
        start: yesterday.startOf('day'),
        end: yesterday.endOf('day')
      };
    }
    case 'week':
      return {
        start: current.startOf('week'),
        end: current.endOf('week')
      };
    case 'month':
      return {
        start: current.startOf('month'),
        end: current.endOf('month')
      };
    case 'year':
      return {
        start: current.startOf('year'),
        end: current.endOf('year')
      };
    default:
      return {
        start: current.startOf('day'),
        end: current.endOf('day')
      };
  }
};

// Form 表单兼容性
export const getFormItemProps = () => {
  if (isAntd4()) {
    return {
      // Ant Design 4.x 特有的属性
      colon: true,
    };
  } else {
    return {
      // Ant Design 5.x 特有的属性
      variant: 'outlined' as const,
    };
  }
};

// DatePicker 兼容性
export const getDatePickerProps = () => {
  if (isAntd4()) {
    return {
      // Ant Design 4.x 使用 moment
      showTime: true,
    };
  } else {
    return {
      // Ant Design 5.x 使用 dayjs
      showTime: true,
      needConfirm: false,
    };
  }
};

// Table 兼容性
export const getTableProps = () => {
  if (isAntd4()) {
    return {
      // Ant Design 4.x 特有的属性
      size: 'middle' as const,
    };
  } else {
    return {
      // Ant Design 5.x 特有的属性
      size: 'middle' as const,
      virtual: true,
    };
  }
};

// Button 兼容性
export const getButtonProps = () => {
  if (isAntd4()) {
    return {
      // Ant Design 4.x 特有的属性
      type: 'primary' as const,
    };
  } else {
    return {
      // Ant Design 5.x 特有的属性
      type: 'primary' as const,
      variant: 'solid' as const,
    };
  }
};

// 主题兼容性
export const getThemeConfig = () => {
  if (isAntd4()) {
    return {
      // Ant Design 4.x 主题配置
      '@primary-color': '#1890ff',
      '@border-radius-base': '6px',
    };
  } else {
    return {
      // Ant Design 5.x 主题配置
      token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
      },
    };
  }
};

// 图标兼容性
export const getIconComponent = (iconName: string) => {
  try {
    if (isAntd4()) {
      // Ant Design 4.x 图标导入方式
      const icons = require('@ant-design/icons');
      return icons[iconName];
    } else {
      // Ant Design 5.x 图标导入方式（相同）
      const icons = require('@ant-design/icons');
      return icons[iconName];
    }
  } catch {
    return null;
  }
};

// 消息提示兼容性
export const showMessage = {
  success: (content: string) => {
    if (isAntd4()) {
      const { message } = require('antd');
      message.success(content);
    } else {
      const { message } = require('antd');
      message.success(content);
    }
  },
  error: (content: string) => {
    if (isAntd4()) {
      const { message } = require('antd');
      message.error(content);
    } else {
      const { message } = require('antd');
      message.error(content);
    }
  },
  warning: (content: string) => {
    if (isAntd4()) {
      const { message } = require('antd');
      message.warning(content);
    } else {
      const { message } = require('antd');
      message.warning(content);
    }
  },
};

// 工具函数：安全地获取 Ant Design 组件
export const getAntdComponent = (componentName: string) => {
  try {
    const antd = require('antd');
    return antd[componentName];
  } catch {
    return null;
  }
};

// 类型定义
export type AntdVersion = '4' | '5';
export type TimeUnit = 'day' | 'hour' | 'minute' | 'second';
export type TimeRangeType = 'today' | 'yesterday' | 'week' | 'month' | 'year';

// 导出所有兼容性工具
export default {
  getAntdVersion,
  isAntd4,
  isAntd5,
  createMoment,
  formatDate,
  now,
  isBefore,
  isAfter,
  addTime,
  subtractTime,
  getTimestamp,
  getUnixTimestamp,
  getTimeRange,
  getFormItemProps,
  getDatePickerProps,
  getTableProps,
  getButtonProps,
  getThemeConfig,
  getIconComponent,
  showMessage,
  getAntdComponent,
};