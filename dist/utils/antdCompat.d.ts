import type { Moment } from 'moment';
import type { Dayjs } from 'dayjs';
export declare const getAntdVersion: () => '4' | '5';
export declare const isAntd4: () => boolean;
export declare const isAntd5: () => boolean;
export declare const createMoment: (date?: number | Date | string | Moment | Dayjs) => Moment | Dayjs;
export declare const formatDate: (date: number | Date | string | Moment | Dayjs, format?: string) => string;
export declare const now: () => Moment | Dayjs;
export declare const isBefore: (date1: number | Date | string | Moment | Dayjs, date2: number | Date | string | Moment | Dayjs) => boolean;
export declare const isAfter: (date1: number | Date | string | Moment | Dayjs, date2: number | Date | string | Moment | Dayjs) => boolean;
export declare const addTime: (date: number | Date | string | Moment | Dayjs, amount: number, unit?: 'day' | 'hour' | 'minute' | 'second') => Moment | Dayjs;
export declare const subtractTime: (date: number | Date | string | Moment | Dayjs, amount: number, unit?: 'day' | 'hour' | 'minute' | 'second') => Moment | Dayjs;
export declare const getTimestamp: (date?: number | Date | string | Moment | Dayjs) => number;
export declare const getUnixTimestamp: (date?: number | Date | string | Moment | Dayjs) => number;
export declare const getTimeRange: (type: 'today' | 'yesterday' | 'week' | 'month' | 'year') => {
    start: Moment | Dayjs;
    end: Moment | Dayjs;
};
export declare const getFormItemProps: () => {
    colon: boolean;
    variant?: undefined;
} | {
    variant: "outlined";
    colon?: undefined;
};
export declare const getDatePickerProps: () => {
    showTime: boolean;
    needConfirm?: undefined;
} | {
    showTime: boolean;
    needConfirm: boolean;
};
export declare const getTableProps: () => {
    size: "middle";
    virtual?: undefined;
} | {
    size: "middle";
    virtual: boolean;
};
export declare const getButtonProps: () => {
    type: "primary";
    variant?: undefined;
} | {
    type: "primary";
    variant: "solid";
};
export declare const getThemeConfig: () => {
    '@primary-color': string;
    '@border-radius-base': string;
    token?: undefined;
} | {
    token: {
        colorPrimary: string;
        borderRadius: number;
    };
    '@primary-color'?: undefined;
    '@border-radius-base'?: undefined;
};
export declare const getIconComponent: (iconName: string) => any;
export declare const showMessage: {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
};
export declare const getAntdComponent: (componentName: string) => any;
export type AntdVersion = '4' | '5';
export type TimeUnit = 'day' | 'hour' | 'minute' | 'second';
export type TimeRangeType = 'today' | 'yesterday' | 'week' | 'month' | 'year';
declare const _default: {
    getAntdVersion: () => "4" | "5";
    isAntd4: () => boolean;
    isAntd5: () => boolean;
    createMoment: (date?: string | number | Date | Moment | Dayjs | undefined) => Moment | Dayjs;
    formatDate: (date: string | number | Date | Moment | Dayjs, format?: string) => string;
    now: () => Moment | Dayjs;
    isBefore: (date1: string | number | Date | Moment | Dayjs, date2: string | number | Date | Moment | Dayjs) => boolean;
    isAfter: (date1: string | number | Date | Moment | Dayjs, date2: string | number | Date | Moment | Dayjs) => boolean;
    addTime: (date: string | number | Date | Moment | Dayjs, amount: number, unit?: "day" | "hour" | "minute" | "second") => Moment | Dayjs;
    subtractTime: (date: string | number | Date | Moment | Dayjs, amount: number, unit?: "day" | "hour" | "minute" | "second") => Moment | Dayjs;
    getTimestamp: (date?: string | number | Date | Moment | Dayjs | undefined) => number;
    getUnixTimestamp: (date?: string | number | Date | Moment | Dayjs | undefined) => number;
    getTimeRange: (type: "today" | "yesterday" | "week" | "month" | "year") => {
        start: Moment | Dayjs;
        end: Moment | Dayjs;
    };
    getFormItemProps: () => {
        colon: boolean;
        variant?: undefined;
    } | {
        variant: "outlined";
        colon?: undefined;
    };
    getDatePickerProps: () => {
        showTime: boolean;
        needConfirm?: undefined;
    } | {
        showTime: boolean;
        needConfirm: boolean;
    };
    getTableProps: () => {
        size: "middle";
        virtual?: undefined;
    } | {
        size: "middle";
        virtual: boolean;
    };
    getButtonProps: () => {
        type: "primary";
        variant?: undefined;
    } | {
        type: "primary";
        variant: "solid";
    };
    getThemeConfig: () => {
        '@primary-color': string;
        '@border-radius-base': string;
        token?: undefined;
    } | {
        token: {
            colorPrimary: string;
            borderRadius: number;
        };
        '@primary-color'?: undefined;
        '@border-radius-base'?: undefined;
    };
    getIconComponent: (iconName: string) => any;
    showMessage: {
        success: (content: string) => void;
        error: (content: string) => void;
        warning: (content: string) => void;
    };
    getAntdComponent: (componentName: string) => any;
};
export default _default;
