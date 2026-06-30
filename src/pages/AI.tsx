import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Sparkles,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useTripStore } from '@/store/useTripStore';
import { useUIStore } from '@/store/useUIStore';
import { TRAVEL_PREFERENCES } from '@/config/constants';
import { getPOIsByCity } from '@/data/pois';
import type { Trip } from '@/store/useTripStore';

export function AI() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    days: 5,
    nights: 4,
    people: 2,
    startDate: '',
    budget: 5000,
    preferences: [] as string[],
  });
  const [generatedTrip, setGeneratedTrip] = useState<Trip | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addTrip = useTripStore((state) => state.addTrip);
  const addToast = useUIStore((state) => state.addToast);

  const handlePreferenceClick = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const handleGenerate = async () => {
    if (!formData.destination || !formData.startDate) {
      addToast({ type: 'error', message: '请填写完整信息' });
      return;
    }

    setIsGenerating(true);
    try {
      // 模拟 AI 生成延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const pois = getPOIsByCity(formData.destination);
      const selectedPOIs = pois.slice(0, formData.days * 3);

      // 创建行程
      const trip = addTrip({
        name: formData.name || `${formData.destination}之旅`,
        destination: formData.destination,
        days: formData.days,
        nights: formData.nights,
        people: formData.people,
        startDate: formData.startDate,
        status: 'planning',
      });

      // 添加景点到每日行程
      const dayItems = selectedPOIs.map((poi, idx) => ({
        poiId: poi.id,
        poi,
        startTime: `${9 + idx * 2}:00`,
        endTime: `${11 + idx * 2}:00`,
      }));

      // 分配到每天
      trip.schedule.forEach((day, dayIdx) => {
        const startIdx = dayIdx * 3;
        const itemsForDay = dayItems.slice(startIdx, startIdx + 3);
        itemsForDay.forEach((item) => {
          useTripStore.getState().addDayItem(trip.id, day.dayIndex, item);
        });
      });

      setGeneratedTrip(trip);
      setStep(3);
      addToast({ type: 'success', message: '行程生成成功!' });
    } catch (error) {
      addToast({ type: 'error', message: '生成失败,请重试' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
      {/* 进度指示器 */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={twMerge(
              clsx(
                'flex items-center gap-2',
                s <= step ? 'text-indigo-600' : 'text-gray-400'
              )
            )}
          >
            <div
              className={twMerge(
                clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  s <= step
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-gray-200'
                )
              )}
            >
              {s < step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-medium">{s}</span>
              )}
            </div>
            <span className="text-sm font-medium hidden md:block">
              {s === 1 ? '基本信息' : s === 2 ? '偏好设置' : '生成行程'}
            </span>
          </div>
        ))}
      </div>

      {/* 步骤 1: 基本信息 */}
      {step === 1 && (
        <GlassCard className="animate-fade-in">
          <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            基本信息
          </h2>

          <div className="space-y-4">
            <Input
              label="行程名称"
              placeholder="例如: 北京之旅"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="目的地城市"
              placeholder="请输入城市名称"
              icon={<MapPin className="w-5 h-5" />}
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  旅游天数
                </label>
                <div className="glass-input flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        days: Number(e.target.value),
                        nights: Math.min(Number(e.target.value), formData.nights),
                      })
                    }
                    className="w-full bg-transparent outline-none"
                  />
                  <span className="text-gray-500">天</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  住宿夜数
                </label>
                <div className="glass-input flex items-center">
                  <input
                    type="number"
                    min={0}
                    max={formData.days}
                    value={formData.nights}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nights: Math.min(Number(e.target.value), formData.days),
                      })
                    }
                    className="w-full bg-transparent outline-none"
                  />
                  <span className="text-gray-500">夜</span>
                </div>
              </div>
            </div>

            <Input
              label="出行人数"
              type="number"
              min={1}
              icon={<Users className="w-5 h-5" />}
              value={formData.people}
              onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
            />

            <Input
              label="出发日期"
              type="date"
              icon={<Calendar className="w-5 h-5" />}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button onClick={() => setStep(2)} icon={<Sparkles className="w-5 h-5" />}>
                下一步
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* 步骤 2: 偏好设置 */}
      {step === 2 && (
        <GlassCard className="animate-fade-in">
          <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            偏好设置
          </h2>

          <div className="space-y-6">
            {/* 预算 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                预算范围
              </label>
              <div className="glass-input flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full bg-transparent outline-none"
                />
                <span className="text-gray-500">元</span>
              </div>
            </div>

            {/* 旅行偏好 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                旅行偏好
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_PREFERENCES.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => handlePreferenceClick(pref)}
                    className={twMerge(
                      clsx(
                        'px-4 py-2 rounded-xl text-sm transition-all duration-200',
                        formData.preferences.includes(pref)
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 border border-indigo-500/30'
                          : 'bg-white/10 text-gray-600 hover:bg-white/20'
                      )
                    )}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                上一步
              </Button>
              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                icon={<Sparkles className="w-5 h-5" />}
              >
                AI 生成行程
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* 步骤 3: 生成结果 */}
      {step === 3 && generatedTrip && (
        <GlassCard className="animate-fade-in">
          <h2 className="text-xl font-semibold gradient-text mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            行程已生成
          </h2>

          <div className="space-y-4">
            <div className="glass-card bg-white/5 p-4 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">{generatedTrip.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {generatedTrip.destination} · {generatedTrip.days}天{generatedTrip.nights}夜 · {generatedTrip.people}人
              </p>
            </div>

            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                重新规划
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `/trip/${generatedTrip.id}`;
                }}
              >
                查看行程详情
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}