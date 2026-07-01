import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  Info,
  Moon,
  ChevronRight,
  Camera,
  Edit2,
  X,
  Check,
  Trash2,
  MapPin,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useTripStore } from '@/store/useTripStore';

// 预设头像文字
const presetAvatars = ['旅', '行', '星', '云', '山', '海', '风', '月', '日', '梦', '途', '远'];

export default function Settings() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useTripStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editNickname, setEditNickname] = useState(userProfile.nickname);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveProfile = () => {
    updateUserProfile({
      nickname: editNickname.trim() || '旅行爱好者',
      bio: editBio.trim() || '世界那么大，一起去看看',
      avatar: editAvatar,
    });
    setShowEditProfile(false);
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const SettingItem = ({
    icon: Icon,
    label,
    value,
    onClick,
    toggle,
    toggleValue,
    onToggle,
    danger,
  }: {
    icon: LucideIcon;
    label: string;
    value?: string;
    onClick?: () => void;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (v: boolean) => void;
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={toggle}
      className={`w-full flex items-center gap-4 p-4 hover:bg-white/40 transition-colors ${
        danger ? 'text-red-500' : 'text-gray-700'
      }`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
        danger ? 'bg-red-500/10' : 'bg-primary-mid/10'
      }`}>
        <Icon size={18} className={danger ? 'text-red-500' : 'text-primary-mid'} />
      </div>
      <span className="flex-1 text-left font-medium">{label}</span>
      {toggle && onToggle !== undefined && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(!toggleValue);
          }}
          className={`w-12 h-7 rounded-full transition-colors relative ${
            toggleValue ? 'bg-gradient-primary' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              toggleValue ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      )}
      {value && !toggle && (
        <span className="text-sm text-gray-400 max-w-[120px] truncate">{value}</span>
      )}
      {!toggle && !value && !danger && (
        <ChevronRight size={18} className="text-gray-300" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-20 md:pt-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white/70 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">设置</h1>
        </div>

        {/* 用户卡片 */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white text-xl font-bold">{userProfile.avatar}</span>
              </div>
              <button
                onClick={() => {
                  setEditAvatar(userProfile.avatar);
                  setEditNickname(userProfile.nickname);
                  setEditBio(userProfile.bio);
                  setShowEditProfile(true);
                }}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Camera size={13} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {userProfile.nickname}
              </h2>
              <p className="text-sm text-gray-500 truncate">{userProfile.bio}</p>
            </div>
            <button
              onClick={() => {
                setEditAvatar(userProfile.avatar);
                setEditNickname(userProfile.nickname);
                setEditBio(userProfile.bio);
                setShowEditProfile(true);
              }}
              className="p-2 rounded-lg hover:bg-white/40 transition-colors"
            >
              <Edit2 size={18} className="text-gray-400" />
            </button>
          </div>
        </GlassCard>

        {/* 偏好设置 */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">通用</h3>
            <GlassCard className="overflow-hidden divide-y divide-white/20">
              <SettingItem
                icon={Bell}
                label="消息通知"
                toggle
                toggleValue={notifications}
                onToggle={setNotifications}
              />
              <SettingItem
                icon={Moon}
                label="深色模式"
                toggle
                toggleValue={darkMode}
                onToggle={setDarkMode}
              />
              <SettingItem
                icon={Globe}
                label="语言"
                value="简体中文"
              />
            </GlassCard>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">账户</h3>
            <GlassCard className="overflow-hidden divide-y divide-white/20">
              <SettingItem
                icon={Shield}
                label="隐私设置"
              />
              <SettingItem
                icon={MapPin}
                label="我的收藏"
                onClick={() => navigate('/profile')}
              />
            </GlassCard>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 px-1">其他</h3>
            <GlassCard className="overflow-hidden divide-y divide-white/20">
              <SettingItem
                icon={HelpCircle}
                label="帮助与反馈"
              />
              <SettingItem
                icon={Info}
                label="关于途迹"
                value="v1.0.0"
              />
              <SettingItem
                icon={Trash2}
                label="清除本地数据"
                danger
                onClick={() => setShowClearConfirm(true)}
              />
            </GlassCard>
          </div>
        </div>
      </div>

      {/* 编辑资料弹窗 */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl animate-bounce-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
              <button
                onClick={() => setShowEditProfile(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
              <h3 className="text-lg font-bold text-gray-800">编辑资料</h3>
              <button
                onClick={handleSaveProfile}
                className="w-8 h-8 rounded-full bg-gradient-primary hover:opacity-90 flex items-center justify-center transition-opacity"
              >
                <Check size={18} className="text-white" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* 头像选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <User size={14} className="inline mr-1 text-primary-mid" />
                  选择头像
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {presetAvatars.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setEditAvatar(ch)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                        editAvatar === ch
                          ? 'bg-gradient-primary text-white scale-110 shadow-lg shadow-primary-mid/30'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* 昵称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-mid focus:ring-2 focus:ring-primary-mid/20 outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{editNickname.length}/20</p>
              </div>

              {/* 个性签名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">个性签名</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={50}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-mid focus:ring-2 focus:ring-primary-mid/20 outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{editBio.length}/50</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 清除数据确认 */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">清除本地数据</h3>
              <p className="text-sm text-gray-500 mb-6">
                确定要清除所有本地数据吗？包括行程、收藏、消费记录和个人资料，此操作不可撤销。
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  清除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
