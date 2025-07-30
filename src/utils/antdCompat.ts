// Ant Design 版本兼容性工具
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
export const createMoment = (date: number | Date) => {
  if (isAntd4()) {
    const moment = require('moment');
    return moment(date);
  } else {
    const dayjs = require('dayjs');
    return dayjs(date);
  }
};