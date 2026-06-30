export const POI_TYPES = {
  ATTRACTION: 'attraction',
  RESTAURANT: 'restaurant',
  HOTEL: 'hotel',
  SHOPPING: 'shopping',
  TRANSPORT: 'transport'
}

export const POI_TYPE_LABELS = {
  [POI_TYPES.ATTRACTION]: '景点',
  [POI_TYPES.RESTAURANT]: '餐饮',
  [POI_TYPES.HOTEL]: '住宿',
  [POI_TYPES.SHOPPING]: '购物',
  [POI_TYPES.TRANSPORT]: '交通'
}

export const TRAVEL_PREFERENCES = [
  { id: 'nature', label: '自然风光', icon: 'Mountain' },
  { id: 'culture', label: '历史文化', icon: 'Landmark' },
  { id: 'food', label: '美食探店', icon: 'UtensilsCrossed' },
  { id: 'relax', label: '休闲度假', icon: 'Beach' },
  { id: 'shopping', label: '购物血拼', icon: 'ShoppingBag' },
  { id: 'adventure', label: '户外探险', icon: 'Compass' }
]

export const BUDGET_CATEGORIES = [
  { id: 'transport', label: '交通', icon: 'Car', color: 'text-blue-500' },
  { id: 'accommodation', label: '住宿', icon: 'Hotel', color: 'text-purple-500' },
  { id: 'food', label: '餐饮', icon: 'Utensils', color: 'text-orange-500' },
  { id: 'tickets', label: '门票', icon: 'Ticket', color: 'text-emerald-500' },
  { id: 'shopping', label: '购物', icon: 'ShoppingBag', color: 'text-pink-500' },
  { id: 'other', label: '其他', icon: 'MoreHorizontal', color: 'text-gray-500' }
]

export const CITIES = [
  { id: 'beijing', name: '北京', country: '中国', lat: 39.9042, lng: 116.4074 },
  { id: 'shanghai', name: '上海', country: '中国', lat: 31.2304, lng: 121.4737 },
  { id: 'guangzhou', name: '广州', country: '中国', lat: 23.1291, lng: 113.2644 },
  { id: 'shenzhen', name: '深圳', country: '中国', lat: 22.5431, lng: 114.0579 },
  { id: 'hangzhou', name: '杭州', country: '中国', lat: 30.2741, lng: 120.1551 },
  { id: 'chengdu', name: '成都', country: '中国', lat: 30.5728, lng: 104.0668 },
  { id: 'xian', name: '西安', country: '中国', lat: 34.3416, lng: 108.9398 },
  { id: 'chongqing', name: '重庆', country: '中国', lat: 29.4316, lng: 106.9123 },
  { id: 'xiamen', name: '厦门', country: '中国', lat: 24.4798, lng: 118.0894 },
  { id: 'sanya', name: '三亚', country: '中国', lat: 18.2528, lng: 109.5119 }
]

export const pois = [
  {
    id: 'poi-001',
    name: '故宫博物院',
    type: POI_TYPES.ATTRACTION,
    city: 'beijing',
    cityName: '北京',
    address: '北京市东城区景山前街4号',
    lat: 39.9163,
    lng: 116.3972,
    rating: 4.9,
    reviewCount: 125680,
    price: 60,
    duration: 180,
    openTime: '08:30-17:00',
    description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
    images: [
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
      'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800'
    ],
    tags: ['历史文化', '世界遗产', '必打卡'],
    preferenceTags: ['culture']
  },
  {
    id: 'poi-002',
    name: '长城（八达岭）',
    type: POI_TYPES.ATTRACTION,
    city: 'beijing',
    cityName: '北京',
    address: '北京市延庆区八达岭镇',
    lat: 40.3576,
    lng: 116.0206,
    rating: 4.8,
    reviewCount: 98765,
    price: 45,
    duration: 240,
    openTime: '07:30-18:00',
    description: '万里长城的重要组成部分，是明长城的一个隘口，气势雄伟壮观。',
    images: [
      'https://images.unsplash.com/photo-1508804052814-cd3ba865a116?w=800'
    ],
    tags: ['历史文化', '世界遗产', '自然风光'],
    preferenceTags: ['culture', 'nature', 'adventure']
  },
  {
    id: 'poi-003',
    name: '天坛公园',
    type: POI_TYPES.ATTRACTION,
    city: 'beijing',
    cityName: '北京',
    address: '北京市东城区天坛东里甲1号',
    lat: 39.8822,
    lng: 116.4109,
    rating: 4.7,
    reviewCount: 56432,
    price: 34,
    duration: 120,
    openTime: '06:00-22:00',
    description: '明清两代帝王祭祀皇天、祈五谷丰登的场所，建筑设计精妙绝伦。',
    images: [
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800'
    ],
    tags: ['历史文化', '古建筑'],
    preferenceTags: ['culture']
  },
  {
    id: 'poi-004',
    name: '外滩',
    type: POI_TYPES.ATTRACTION,
    city: 'shanghai',
    cityName: '上海',
    address: '上海市黄浦区中山东一路',
    lat: 31.2397,
    lng: 121.4905,
    rating: 4.8,
    reviewCount: 156789,
    price: 0,
    duration: 90,
    openTime: '全天开放',
    description: '上海的标志性景观，万国建筑博览群与陆家嘴摩天大楼交相辉映。',
    images: [
      'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800'
    ],
    tags: ['城市风光', '夜景', '必打卡'],
    preferenceTags: ['culture', 'relax']
  },
  {
    id: 'poi-005',
    name: '东方明珠',
    type: POI_TYPES.ATTRACTION,
    city: 'shanghai',
    cityName: '上海',
    address: '上海市浦东新区世纪大道1号',
    lat: 31.2397,
    lng: 121.4998,
    rating: 4.6,
    reviewCount: 87654,
    price: 180,
    duration: 120,
    openTime: '09:00-21:00',
    description: '上海地标性建筑，塔高468米，可360度俯瞰上海城市风光。',
    images: [
      'https://images.unsplash.com/photo-1548266652-99cf27701ced?w=800'
    ],
    tags: ['城市风光', '地标', '观景'],
    preferenceTags: ['relax']
  },
  {
    id: 'poi-006',
    name: '西湖',
    type: POI_TYPES.ATTRACTION,
    city: 'hangzhou',
    cityName: '杭州',
    address: '浙江省杭州市西湖区',
    lat: 30.2587,
    lng: 120.1305,
    rating: 4.9,
    reviewCount: 234567,
    price: 0,
    duration: 300,
    openTime: '全天开放',
    description: '中国十大风景名胜之一，以秀丽的湖光山色和众多的名胜古迹闻名中外。',
    images: [
      'https://images.unsplash.com/photo-1592828009812-b7c53c6c3a0c?w=800'
    ],
    tags: ['自然风光', '世界遗产', '必打卡'],
    preferenceTags: ['nature', 'relax', 'culture']
  },
  {
    id: 'poi-007',
    name: '灵隐寺',
    type: POI_TYPES.ATTRACTION,
    city: 'hangzhou',
    cityName: '杭州',
    address: '浙江省杭州市西湖区灵隐路法云弄1号',
    lat: 30.2417,
    lng: 120.1017,
    rating: 4.7,
    reviewCount: 67890,
    price: 75,
    duration: 150,
    openTime: '07:00-18:00',
    description: '浙江省最古老的佛教寺院，环境清幽，香火鼎盛。',
    images: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800'
    ],
    tags: ['历史文化', '宗教', '古建筑'],
    preferenceTags: ['culture', 'nature']
  },
  {
    id: 'poi-008',
    name: '成都大熊猫繁育研究基地',
    type: POI_TYPES.ATTRACTION,
    city: 'chengdu',
    cityName: '成都',
    address: '四川省成都市成华区熊猫大道1375号',
    lat: 30.7209,
    lng: 104.1058,
    rating: 4.8,
    reviewCount: 178901,
    price: 55,
    duration: 240,
    openTime: '07:30-18:00',
    description: '世界著名的大熊猫迁地保护基地，可近距离观看国宝大熊猫。',
    images: [
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800'
    ],
    tags: ['自然风光', '亲子', '必打卡'],
    preferenceTags: ['nature', 'adventure']
  },
  {
    id: 'poi-009',
    name: '锦里古街',
    type: POI_TYPES.ATTRACTION,
    city: 'chengdu',
    cityName: '成都',
    address: '四川省成都市武侯区武侯祠大街231号',
    lat: 30.6461,
    lng: 104.0454,
    rating: 4.6,
    reviewCount: 98765,
    price: 0,
    duration: 120,
    openTime: '09:00-22:00',
    description: '成都知名的步行商业街，汇集了四川特色小吃和传统手工艺品。',
    images: [
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800'
    ],
    tags: ['美食', '历史文化', '购物'],
    preferenceTags: ['food', 'culture', 'shopping']
  },
  {
    id: 'poi-010',
    name: '兵马俑',
    type: POI_TYPES.ATTRACTION,
    city: 'xian',
    cityName: '西安',
    address: '陕西省西安市临潼区秦陵北路',
    lat: 34.3849,
    lng: 109.2759,
    rating: 4.9,
    reviewCount: 198765,
    price: 120,
    duration: 180,
    openTime: '08:30-18:00',
    description: '世界第八大奇迹，举世闻名的秦代地下军阵，震撼人心。',
    images: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800'
    ],
    tags: ['历史文化', '世界遗产', '必打卡'],
    preferenceTags: ['culture']
  },
  {
    id: 'poi-011',
    name: '大雁塔',
    type: POI_TYPES.ATTRACTION,
    city: 'xian',
    cityName: '西安',
    address: '陕西省西安市雁塔区慈恩路1号',
    lat: 34.2183,
    lng: 108.9665,
    rating: 4.5,
    reviewCount: 56789,
    price: 50,
    duration: 90,
    openTime: '08:00-19:00',
    description: '唐代著名佛塔，玄奘法师主持修建，是西安的标志性建筑之一。',
    images: [
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800'
    ],
    tags: ['历史文化', '古建筑'],
    preferenceTags: ['culture']
  },
  {
    id: 'poi-012',
    name: '洪崖洞',
    type: POI_TYPES.ATTRACTION,
    city: 'chongqing',
    cityName: '重庆',
    address: '重庆市渝中区嘉陵江滨江路88号',
    lat: 29.5630,
    lng: 106.5795,
    rating: 4.7,
    reviewCount: 234567,
    price: 0,
    duration: 120,
    openTime: '11:00-23:00',
    description: '重庆最具特色的吊脚楼建筑群，夜景璀璨，宛如千与千寻的童话世界。',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'
    ],
    tags: ['夜景', '美食', '必打卡'],
    preferenceTags: ['food', 'culture', 'relax']
  },
  {
    id: 'poi-013',
    name: '鼓浪屿',
    type: POI_TYPES.ATTRACTION,
    city: 'xiamen',
    cityName: '厦门',
    address: '福建省厦门市思明区鼓浪屿',
    lat: 24.4457,
    lng: 118.0655,
    rating: 4.8,
    reviewCount: 156789,
    price: 35,
    duration: 300,
    openTime: '全天开放',
    description: '厦门著名的海上花园，岛上风景秀丽，建筑风格多样。',
    images: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'
    ],
    tags: ['自然风光', '历史文化', '海岛'],
    preferenceTags: ['nature', 'culture', 'relax']
  },
  {
    id: 'poi-014',
    name: '亚龙湾',
    type: POI_TYPES.ATTRACTION,
    city: 'sanya',
    cityName: '三亚',
    address: '海南省三亚市吉阳区亚龙湾路',
    lat: 18.2140,
    lng: 109.6473,
    rating: 4.9,
    reviewCount: 123456,
    price: 0,
    duration: 240,
    openTime: '全天开放',
    description: '被誉为"天下第一湾"，沙滩细腻，海水清澈，是度假休闲的绝佳去处。',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ],
    tags: ['自然风光', '海滩', '度假'],
    preferenceTags: ['nature', 'relax']
  },
  {
    id: 'poi-015',
    name: '南翔小笼馆',
    type: POI_TYPES.RESTAURANT,
    city: 'shanghai',
    cityName: '上海',
    address: '上海市黄浦区豫园路85号',
    lat: 31.2272,
    lng: 121.4925,
    rating: 4.5,
    reviewCount: 45678,
    price: 50,
    duration: 60,
    openTime: '07:00-21:00',
    description: '上海老字号，以皮薄馅多、汤汁鲜美的小笼包闻名。',
    images: [
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800'
    ],
    tags: ['美食', '老字号', '上海菜'],
    preferenceTags: ['food']
  },
  {
    id: 'poi-016',
    name: '海底捞火锅',
    type: POI_TYPES.RESTAURANT,
    city: 'chengdu',
    cityName: '成都',
    address: '四川省成都市锦江区春熙路',
    lat: 30.6532,
    lng: 104.0815,
    rating: 4.8,
    reviewCount: 87654,
    price: 120,
    duration: 120,
    openTime: '10:00-次日03:00',
    description: '以服务著称的四川火锅连锁，菜品丰富，味道正宗。',
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'
    ],
    tags: ['美食', '火锅', '川菜'],
    preferenceTags: ['food']
  }
]

export const getPOIById = (id) => pois.find(poi => poi.id === id)

export const getPOIsByCity = (cityId) => pois.filter(poi => poi.city === cityId)

export const getPOIsByType = (type) => pois.filter(poi => poi.type === type)

export const searchPOIs = (keyword) => {
  const lowerKeyword = keyword.toLowerCase()
  return pois.filter(poi => 
    poi.name.toLowerCase().includes(lowerKeyword) ||
    poi.cityName.includes(keyword) ||
    poi.tags.some(tag => tag.includes(keyword)) ||
    poi.description.includes(keyword)
  )
}

export default pois
