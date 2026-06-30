import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 格式化日期
export const formatDate = (date: string | Date, pattern = 'yyyy-MM-dd'): string => {
  return format(new Date(date), pattern, { locale: zhCN });
};

// 格式化相对时间
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
};

// 格式化金额
export const formatCurrency = (amount: number, currency = 'CNY'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
};

// 格式化数字
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-CN').format(num);
};

// 格式化评分
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// 格式化行程天数
export const formatTripDays = (days: number, nights: number): string => {
  return `${days}天${nights}夜`;
};

// 格式化时间范围
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

// 格式化地址
export const formatAddress = (city: string, address: string): string => {
  return `${city} · ${address}`;
};