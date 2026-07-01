export interface WeatherData {
  city: string;
  current: CurrentWeather;
  forecast: DayForecast[];
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
}

export interface DayForecast {
  date: string;
  dayOfWeek: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  precipitation: number;
}

export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'thunderstorm'
  | 'snowy'
  | 'foggy';

const conditionMap: Record<WeatherCondition, { label: string; icon: string; gradient: string }> = {
  sunny: { label: '晴', icon: '☀️', gradient: 'from-yellow-400 to-orange-400' },
  'partly-cloudy': { label: '多云', icon: '⛅', gradient: 'from-blue-400 to-gray-400' },
  cloudy: { label: '阴', icon: '☁️', gradient: 'from-gray-400 to-gray-500' },
  rainy: { label: '小雨', icon: '🌧️', gradient: 'from-blue-500 to-blue-700' },
  thunderstorm: { label: '雷阵雨', icon: '⛈️', gradient: 'from-purple-500 to-gray-700' },
  snowy: { label: '雪', icon: '❄️', gradient: 'from-blue-300 to-white' },
  foggy: { label: '雾', icon: '🌫️', gradient: 'from-gray-300 to-gray-500' },
};

export const weatherInfo = (condition: WeatherCondition) => conditionMap[condition];

// 模拟天气数据生成（基于城市名的伪随机，保证同一城市结果一致）
export function generateMockWeather(city: string, days: number = 7): WeatherData {
  const seed = hashString(city);
  const rng = seededRandom(seed);

  const conditions: WeatherCondition[] = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'sunny', 'partly-cloudy', 'thunderstorm'];
  const baseTemp = 15 + (seed % 15);

  const currentCondition = conditions[seed % conditions.length];
  const currentTemp = Math.round(baseTemp + rng() * 10);

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date();

  const forecast: DayForecast[] = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayCondition = conditions[Math.floor(rng() * conditions.length)];
    const dayTemp = baseTemp + rng() * 8;
    return {
      date: date.toISOString().split('T')[0],
      dayOfWeek: i === 0 ? '今天' : weekDays[date.getDay()],
      condition: dayCondition,
      high: Math.round(dayTemp + rng() * 5),
      low: Math.round(dayTemp - 5 - rng() * 5),
      precipitation: Math.round(rng() * 100),
    };
  });

  return {
    city,
    current: {
      temp: currentTemp,
      feelsLike: currentTemp - 2 + Math.round(rng() * 4),
      condition: currentCondition,
      humidity: 40 + Math.round(rng() * 40),
      windSpeed: Math.round(rng() * 20),
      uvIndex: Math.round(rng() * 10),
      visibility: 5 + Math.round(rng() * 15),
    },
    forecast,
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
