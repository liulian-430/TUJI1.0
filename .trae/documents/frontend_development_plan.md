# 途迹 (Tuji) 前端开发计划

## 一、项目概述

基于产品原型进行途迹 (Tuji) 旅行规划 App 的前端开发，确保每个按钮能够正常使用、交互正常、逻辑正常。

### 技术栈
- **框架**: React 18 + TypeScript
- **样式**: TailwindCSS (玻璃态 Glassmorphism 设计)
- **路由**: React Router DOM v7
- **状态管理**: Zustand + persist 中间件 (localStorage 持久化)
- **地图**: React-Leaflet + Leaflet
- **图标**: Lucide React
- **构建工具**: Vite 6

---

## 二、已完成工作 (P0/P1/P2)

### P0 - 核心功能 (已完成)

| 编号 | 功能 | 涉及文件 | 状态 |
|------|------|----------|------|
| P0-1 | GuideDetail 添加到行程完整功能 | `src/pages/GuideDetail.tsx` | ✅ 完成 |
| P0-2 | GuideDetail 底部收藏/分享按钮 | `src/pages/GuideDetail.tsx` | ✅ 完成 |
| P0-3 | POICard 收藏功能 | `src/components/POICard.tsx` | ✅ 完成 |
| P0-4 | Map 页 city/trip URL 参数处理 | `src/pages/Map.tsx` | ✅ 完成 |
| P0-5 | Map 页 Layers 图层切换 | `src/pages/Map.tsx` | ✅ 完成 |

### P1 - 重要功能 (已完成)

| 编号 | 功能 | 涉及文件 | 状态 |
|------|------|----------|------|
| P1-1 | BottomNav 新建行程保存 | `src/components/layout/BottomNav.tsx` | ✅ 完成 |
| P1-2 | Home 更多攻略跳转 | `src/pages/Home.tsx` | ✅ 完成 |
| P1-3 | NewTrip 展开/收起 + 完整参数保存 | `src/pages/NewTrip.tsx` | ✅ 完成 |
| P1-4 | Profile 统计卡片交互 | `src/pages/Profile.tsx` | ✅ 完成 |
| P1-5 | Settings 设置项功能化 | `src/pages/Settings.tsx` | ✅ 完成 |
| P1-5(附) | Toast 全局提示组件 | `src/components/ui/Toast.tsx`, `src/store/useToastStore.ts` | ✅ 完成 |

### P2 - 体验优化 (已完成)

| 编号 | 功能 | 涉及文件 | 状态 |
|------|------|----------|------|
| P2-1 | TripCard 分享改造 + AIPlanner 麦克风确认 | `src/components/trip/TripCard.tsx`, `src/pages/AIPlanner.tsx` | ✅ 完成 |
| P2-2 | 弹窗 ESC 关闭统一 | `src/hooks/useEscKey.ts`, 6 个页面/组件 | ✅ 完成 |

---

## 三、已实现功能详情

### 1. 全局 Toast 提示系统
- **Store**: `useToastStore.ts` - 支持 success/error/info/warning 四种类型
- **组件**: `ToastContainer` - 顶部居中显示，自动消失（2.5秒），支持手动关闭
- **集成**: 所有页面操作均接入 Toast 反馈

### 2. 行程管理功能
- **新建行程**: BottomNav 中间按钮 → 输入行程名 → 保存到 store → 跳转行程详情
- **行程详情**: 展示行程信息、日程安排、POI 列表
- **添加 POI**: GuideDetail → 选择行程/全部添加 → 跳转地图页
- **地图添加**: 地图页点击 POI → 选择日期 → 添加到行程
- **分享行程**: TripCard → 生成分享文案 → navigator.share / 剪贴板

### 3. 收藏与足迹
- **POI 收藏**: POICard 心形按钮 → localStorage 持久化
- **攻略收藏**: GuideDetail 底部收藏按钮
- **足迹统计**: Profile 页面 → 访问过的城市 → 弹窗展示

### 4. 设置功能
- **深色模式**: Toggle 开关 → localStorage 持久化 → 立即切换
- **消息通知**: Toggle 开关 → localStorage 持久化
- **编辑资料**: 头像/昵称/简介 → 保存到 store
- **清除数据**: 确认弹窗 → 清除 localStorage → 刷新页面

### 5. 地图功能
- **URL 参数**: `?trip=xxx` 选中行程, `?city=北京` 搜索城市景点
- **图层切换**: 标准地图 / 卫星地图 / 交通路况
- **POI 管理**: 添加到某天、右滑删除
- **视野重置**: 一键回到行程视野

### 6. AI 规划
- **AI 对话**: 输入需求 → 生成行程 → 预览保存
- **语音输入**: 麦克风按钮 → 模拟语音识别 → 自动填充
- **个性化规划**: 目的地、景点、美食、住宿、预算、人数、天数

### 7. 弹窗 ESC 关闭
- **Hook**: `useEscKey(callback, active)` - 统一 ESC 关闭逻辑
- **已接入**: GuideDetail、BottomNav、Map、Profile、Settings、TripCard

---

## 四、文件结构概览

```
src/
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx        # 底部导航 + 新建行程
│   ├── trip/
│   │   └── TripCard.tsx         # 行程卡片 + 分享
│   └── ui/
│       ├── GlassCard.tsx        # 玻璃态卡片
│       ├── EmptyState.tsx       # 空状态
│       ├── Skeleton.tsx         # 骨架屏
│       └── Toast.tsx            # Toast 提示
├── hooks/
│   └── useEscKey.ts             # ESC 关闭弹窗
├── pages/
│   ├── Home.tsx                 # 首页
│   ├── Map.tsx                  # 地图页
│   ├── GuideDetail.tsx          # 攻略详情
│   ├── Search.tsx               # 搜索页
│   ├── Profile.tsx              # 个人中心
│   ├── Settings.tsx             # 设置页
│   ├── AIPlanner.tsx            # AI 规划
│   ├── NewTrip.tsx              # 新行程确认
│   ├── TripDetail.tsx           # 行程详情
│   └── POIDetail.tsx            # 景点详情
├── store/
│   ├── useTripStore.ts          # 行程状态管理
│   └── useToastStore.ts         # Toast 状态管理
└── data/
    └── mock.ts                  # mock 数据
```

---

## 五、构建验证

- ✅ `npm run build` 构建成功
- ✅ TypeScript 类型检查通过
- ⚠️ 主 chunk 803KB (超出 500KB 警告，可后续代码分割优化)

---

## 六、后续可优化方向 (可选)

### P3 - 体验细节优化
1. **页面过渡动画**: 路由切换添加淡入淡出
2. **下拉刷新**: 首页/列表页添加下拉刷新
3. **骨架屏完善**: 更多页面接入骨架屏
4. **图片懒加载**: 列表图片添加懒加载
5. **错误边界**: 添加 React Error Boundary

### P4 - 性能优化
1. **代码分割**: 路由级别代码分割
2. **图片优化**: WebP 格式、响应式图片
3. **虚拟列表**: 长列表虚拟化
4. **缓存策略**: Service Worker 离线支持

### P5 - 新功能
1. **行程协作**: 多人编辑、权限管理
2. **预算管理**: 消费记录、统计图表
3. **社区功能**: 发布攻略、评论互动
4. **天气集成**: 目的地天气预报
