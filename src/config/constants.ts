// 预算分类
export const BUDGET_CATEGORIES = [
  { key: 'transportation', label: '交通', color: 'blue' },
  { key: 'accommodation', label: '住宿', color: 'purple' },
  { key: 'food', label: '餐饮', color: 'orange' },
  { key: 'ticket', label: '门票', color: 'green' },
  { key: 'shopping', label: '购物', color: 'pink' },
  { key: 'other', label: '其他', color: 'gray' },
] as const;

// 旅行偏好标签
export const TRAVEL_PREFERENCES = [
  '自然风光',
  '历史文化',
  '美食探店',
  '休闲度假',
  '户外运动',
  '亲子游',
  '浪漫蜜月',
  '商务出差',
] as const;

// POI 类型
export const POI_TYPES = [
  { key: '景点', label: '景点', icon: 'MapPin' },
  { key: '美食', label: '美食', icon: 'Utensils' },
  { key: '住宿', label: '住宿', icon: 'Bed' },
  { key: '交通', label: '交通', icon: 'Car' },
] as const;

// 热门城市
export const HOT_CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '西安',
  '重庆',
  '南京',
  '苏州',
  '厦门',
  '大理',
  '丽江',
  '三亚',
  '桂林',
] as const;

// 行程状态
export const TRIP_STATUS = [
  { key: 'planning', label: '计划中', color: 'blue' },
  { key: 'ongoing', label: '进行中', color: 'green' },
  { key: 'completed', label: '已完成', color: 'gray' },
] as const;

// 应用信息
export const APP_INFO = {
  name: '途迹',
  version: '1.0.0',
  description: '智能旅行规划应用',
  author: 'Tuji Team',
};