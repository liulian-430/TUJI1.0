# 途迹前端质量保障计划

## 一、审查结论

经过对 11 个页面 + 12 个组件 + 2 个 store 的全面审查，发现以下类别问题：

### 问题类别
1. **死按钮/无功能按钮**：多个页面存在点击无响应的装饰性按钮
2. **逻辑缺失**：部分交互流程不完整（如添加景点到行程只弹窗不入库）
3. **路由/参数未处理**：URL 参数（city/trip）页面未读取使用
4. **数据不一致**：不同页面相同功能实现方式不统一
5. **体验问题**：弹窗关闭方式、状态反馈不一致

---

## 二、问题清单与修复方案

### P0 级（核心功能缺陷）

#### 1. GuideDetail 添加到行程功能不完整
- **问题**：`confirmAdd` 函数只关闭弹窗，不实际添加 POI 到行程
- **位置**：[GuideDetail.tsx](file:///workspace/src/pages/GuideDetail.tsx) 第 43-45 行
- **修复**：将 GuideDetail 的添加逻辑对齐 POIDetail 的实现
  - 单个 POI 添加：调用 `addPOIToTrip`，按攻略数据转换为 TripPOI 写入 store
  - 添加全部：遍历 poiDetails 批量添加
  - 添加后显示成功状态并跳转地图

#### 2. GuideDetail 底部收藏/分享按钮无效
- **问题**：底部操作栏收藏、分享按钮无 onClick
- **位置**：[GuideDetail.tsx](file:///workspace/src/pages/GuideDetail.tsx) 第 166-172 行
- **修复**：
  - 收藏按钮：接入 `toggleFavoritePOI`（POI 级别的收藏对攻略收藏是 POI 收藏）
  - 分享按钮：调用 `navigator.share` + 复制链接降级

#### 3. POICard 收藏按钮无效
- **问题**：POICard 组件的收藏按钮无功能
- **位置**：[POICard.tsx](file:///workspace/src/components/poi/POICard.tsx) 第 35-37 行、第 55-57 行
- **修复**：接入 store 的 `toggleFavoritePOI`，显示收藏状态

#### 4. Map 页 city URL 参数未处理
- **问题**：首页热门城市点击跳转 `/map?city=xxx`，但 Map 页不读取 city 参数
- **位置**：[Map.tsx](file:///workspace/src/pages/Map.tsx)
- **修复**：读取 URL 参数读取 city 参数，并切换到对应城市的 POI 搜索结果展示

#### 5. Map 页 trip URL 参数未处理
- **问题**：POIDetail 添加行程后跳转 `/map?trip=xxx`，Map 页不读取
- **位置**：[Map.tsx](file:///workspace/src/pages/Map.tsx)
- **修复**：读取 trip 参数，自动选中对应行程

#### 6. Map 页 Layers 按钮无效
- **问题**：地图右上角图层按钮是死按钮
- **位置**：[Map.tsx](file:///workspace/src/pages/Map.tsx) 第 377-379 行
- **修复**：添加地图图层切换（标准/卫星/简化三种底图切换）

---

### P1 级（重要体验缺陷）

#### 7. BottomNav + 号新建行程不保存
- **问题**：点击 + 号弹出新建行程弹窗，输入名称后只跳 profile 不保存
- **位置**：[BottomNav.tsx](file:///workspace/src/components/layout/BottomNav.tsx) 第 80-86 行
- **修复**：创建空行程写入 store 的 `addTrip`，跳转到行程详情页

#### 8. Home 页「更多攻略的更多」按钮无效
- **问题**：发现模块右上角「更多」按钮无功能
- **位置**：[Home.tsx](file:///workspace/src/pages/Home.tsx) 第 133-136 行
- **修复**：点击跳转到搜索页并切换到攻略 Tab

#### 9. NewTrip 「展开」按钮无效
- **问题**：行程预览的展开按钮只是装饰
- **位置**：[NewTrip.tsx](file:///workspace/src/pages/NewTrip.tsx) 第 85-88 行
- **修复**：实现展开/收起切换

#### 10. NewTrip 保存行程缺少 nights/people/budget 未传递
- **问题**：AI 规划的自定义参数（天数、人数、预算等未持久化到行程
- **位置**：[NewTrip.tsx](file:///workspace/src/pages/NewTrip.tsx) 第 17-34 行
- **修复**：pendingTrip 补充这些字段，保存时带上

#### 11. Profile 页足迹/收藏/评价三个统计卡片点击无效
- **问题**：三个 GlassCard 只有 cursor-pointer 但无跳转
- **位置**：[Profile.tsx](file:///workspace/src/pages/Profile.tsx) 第 145-161 行
- **修复**：
  - 收藏：跳转到搜索页展示收藏的 POI 列表
  - 足迹：弹框展示访问过的城市
  - 评价：暂无数据时提示暂无评价

#### 12. Settings 页大多设置项只是 UI 2)
- **问题**：消息通知、深色模式、语言、隐私、帮助等项无功能
- **位置**：[Settings.tsx](file:///workspace/src/pages/Settings.tsx)
- **修复**：
  - 深色模式：实际切换主题（CSS 变量 + localStorage 持久化
  - 消息通知：开关状态持久化
  - 其他项：至少给点击反馈（toast/提示「功能开发中」

---

### P2 级（一致性与体验优化）

#### 13. TripCard 分享用 alert 提示
- **问题**：分享确认后 alert('攻略分享成功！' 体验差
- **位置**：[TripCard.tsx](file:///workspace/src/components/trip/TripCard.tsx) 第 65 行
- **修复**：改用 navigator.share + 复制链接

#### 14. AIPlanner 麦克风按钮无效
- **问题**：AI 规划页的麦克风按钮未审查，检查是否可用
- **位置**：[AIPlanner.tsx](file:///workspace/src/pages/AIPlanner.tsx)
- **修复**：确认麦克风交互对齐 BottomNav 的长按录音逻辑

#### 15. 弹窗关闭方式不统一
- **问题**：有的点背景关闭，有的点击 X 关闭，体验不一致
- **修复**：所有弹窗统一支持：背景点击关闭 + X 按钮关闭 + ESC 关闭

#### 16. 操作无反馈/加载态
- **问题**：删除、添加等操作后无成功/失败反馈
- **修复**：添加统一的 toast 轻提示组件

---

## 三、执行步骤

### 阶段一：P0 核心功能修复（6 项）
1. GuideDetail 添加到行程完整功能
2. GuideDetail 收藏/分享按钮
3. POICard 收藏功能
4. Map 页 city/trip URL 参数处理
5. Map 页 Layers 图层切换

### 阶段二：P1 重要体验修复（6 项）
6. BottomNav 新建行程保存
7. Home 更多攻略跳转
8. NewTrip 展开/收起
9. NewTrip 保存完整参数
10. Profile 统计卡片交互
11. Settings 设置项功能化

### 阶段三：P2 一致性优化（4 项）
12. TripCard 分享改造
13. AIPlanner 麦克风确认
14. 弹窗关闭方式统一
15. Toast 反馈组件

---

## 四、风险与注意事项

1. **数据一致性风险**：GuideDetail 的 GuidePOI 数据结构与 TripPOI 结构不同，需正确转换
2. **地图图层切换风险**：Leaflet 图层切换需注意 TileLayer 切换性能
3. **深色模式风险**：需全局 CSS 变量改造，影响范围大
4. **测试验证**：每阶段完成后运行 `npm run build` 验证构建通过

---

## 五、验证标准

- 所有按钮点击均有响应（跳转/功能/提示）
- 所有弹窗可正常关闭（背景/X/ESC
- 所有数据操作均有状态反馈
- 所有 URL 参数均被正确读取
- `npm run build` 构建通过无错
