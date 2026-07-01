import { Droplets, Wind, Eye, Sun, ThermometerSun } from 'lucide-react';
import GlassCard from './GlassCard';
import { generateMockWeather, weatherInfo } from '@/data/weather';

interface WeatherWidgetProps {
  city: string;
  compact?: boolean;
  className?: string;
}

/**
 * 天气组件 - 完整版本
 * 展示当前天气、温度、湿度、风速等详情 + 7日预报
 */
export default function WeatherWidget({ city, compact = false, className = '' }: WeatherWidgetProps) {
  const weather = generateMockWeather(city, compact ? 3 : 7);
  const current = weather.current;
  const condInfo = weatherInfo(current.condition);

  if (compact) {
    return (
      <GlassCard className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{condInfo.icon}</span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">{current.temp}°</span>
                <span className="text-sm text-gray-500">{condInfo.label}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{city}</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <Droplets size={12} />
              <span>{current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Wind size={12} />
              <span>{current.windSpeed}km/h</span>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 主天气卡片 */}
      <GlassCard className={`p-6 overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${condInfo.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">{city}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-bold gradient-text">{current.temp}°</span>
                <span className="text-gray-600">{condInfo.label}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                体感 {current.feelsLike}°
              </p>
            </div>
            <span className="text-6xl">{condInfo.icon}</span>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/40 rounded-xl p-3 text-center">
              <Droplets size={16} className="mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-gray-500">湿度</p>
              <p className="text-sm font-semibold text-gray-700">{current.humidity}%</p>
            </div>
            <div className="bg-white/40 rounded-xl p-3 text-center">
              <Wind size={16} className="mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-gray-500">风速</p>
              <p className="text-sm font-semibold text-gray-700">{current.windSpeed}km/h</p>
            </div>
            <div className="bg-white/40 rounded-xl p-3 text-center">
              <Sun size={16} className="mx-auto mb-1 text-yellow-500" />
              <p className="text-xs text-gray-500">紫外线</p>
              <p className="text-sm font-semibold text-gray-700">
                {current.uvIndex <= 2 ? '弱' : current.uvIndex <= 5 ? '中' : '强'}
              </p>
            </div>
            <div className="bg-white/40 rounded-xl p-3 text-center">
              <Eye size={16} className="mx-auto mb-1 text-purple-500" />
              <p className="text-xs text-gray-500">能见度</p>
              <p className="text-sm font-semibold text-gray-700">{current.visibility}km</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 7日预报 */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
          <ThermometerSun size={14} className="text-primary-mid" />
          天气预报
        </h3>
        <div className="space-y-2">
          {weather.forecast.map((day) => {
            const dayCond = weatherInfo(day.condition);
            return (
              <div
                key={day.date}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors"
              >
                <span className="text-sm text-gray-600 w-12 flex-shrink-0">{day.dayOfWeek}</span>
                <span className="text-2xl">{dayCond.icon}</span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16">{dayCond.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full"
                      style={{
                        left: `${((day.low + 10) / 50) * 100}%`,
                        width: `${((day.high - day.low) / 50) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right flex gap-2 text-sm flex-shrink-0">
                  <span className="text-gray-800 font-medium">{day.high}°</span>
                  <span className="text-gray-400">{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
