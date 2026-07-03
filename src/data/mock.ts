export interface POI {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  type: 'scenic' | 'food' | 'hotel' | 'shopping';
  rating: number;
  price: number;
  openTime: string;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  days: number;
  nights?: number;
  people?: number;
  startDate: string;
  status: 'planning' | 'in_progress' | 'completed';
  coverImage?: string;
  createdAt?: string;
  budget?: number;
  spent?: number;
  pois: TripPOI[];
  daysList?: DayScheduleSimple[];
}

export interface DaySchedule {
  id: string;
  tripId: string;
  dayIndex: number;
  date: string;
  items: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  poiId: string;
  poi: POI;
  startTime: string;
  endTime: string;
  type: 'scenic' | 'food' | 'hotel' | 'transport' | 'shopping';
}

export interface Budget {
  id: string;
  tripId: string;
  totalBudget: number;
  transportation: number;
  accommodation: number;
  food: number;
  ticket: number;
  shopping: number;
  other: number;
}

export interface Expense {
  id: string;
  tripId: string;
  category: 'transportation' | 'accommodation' | 'food' | 'ticket' | 'shopping' | 'other';
  amount: number;
  date: string;
  note: string;
}

export interface TripPOI {
  id: string;
  name: string;
  type: 'scenic' | 'food' | 'hotel' | 'shopping';
  duration: string;
  price: number;
  image: string;
  latitude?: number;
  longitude?: number;
}

export interface DayScheduleSimple {
  day: number;
  morning?: TripPOI[];
  afternoon?: TripPOI[];
  evening?: TripPOI[];
}

export interface GuidePOI {
  name: string;
  type: 'scenic' | 'food' | 'hotel' | 'shopping';
  duration: string;
  price: number;
  description: string;
  image: string;
}

export interface Guide {
  id: string;
  title: string;
  author: string;
  avatar: string;
  image: string;
  likes: number;
  views: number;
  days: number;
  nights: number;
  destination: string;
  province: string;
  budget: number;
  people: number;
  description: string;
  pois: string[];
  poiDetails: GuidePOI[];
}

// 省份-城市映射表
export const provinceCityMap: Record<string, string[]> = {
  '全部': [],
  '北京市': ['北京'],
  '上海市': ['上海'],
  '四川省': ['成都'],
  '浙江省': ['杭州'],
  '陕西省': ['西安'],
};

export const provinces = Object.keys(provinceCityMap);

export const mockPOIs: POI[] = [
  // 北京
  {
    id: '1',
    name: '故宫博物院',
    city: '北京',
    province: '北京市',
    address: '北京市东城区景山前街4号',
    type: 'scenic',
    rating: 4.8,
    price: 60,
    openTime: '08:30-17:00',
    description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
    images: ['https://picsum.photos/seed/tuji101/800/600', 'https://picsum.photos/seed/tuji102/800/600'],
    latitude: 39.9163,
    longitude: 116.3972,
  },
  {
    id: '2',
    name: '八达岭长城',
    city: '北京',
    province: '北京市',
    address: '北京市延庆区八达岭镇',
    type: 'scenic',
    rating: 4.7,
    price: 45,
    openTime: '07:00-18:00',
    description: '万里长城的代表段落之一，是明长城中保存最完整的一段。',
    images: ['https://picsum.photos/seed/tuji103/800/600'],
    latitude: 40.3652,
    longitude: 116.6044,
  },
  {
    id: '3',
    name: '北京烤鸭店',
    city: '北京',
    province: '北京市',
    address: '北京市东城区前门大街32号',
    type: 'food',
    rating: 4.6,
    price: 200,
    openTime: '10:00-22:00',
    description: '正宗北京烤鸭，皮脆肉嫩，香气四溢。',
    images: ['https://picsum.photos/seed/tuji104/800/600'],
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    id: '4',
    name: '天坛公园',
    city: '北京',
    province: '北京市',
    address: '北京市东城区天坛路甲1号',
    type: 'scenic',
    rating: 4.7,
    price: 34,
    openTime: '06:00-21:00',
    description: '明清两代帝王祭天、祈谷的场所，建筑宏伟壮观。',
    images: ['https://picsum.photos/seed/tuji105/800/600'],
    latitude: 39.9432,
    longitude: 116.4107,
  },
  {
    id: '5',
    name: '王府井步行街',
    city: '北京',
    province: '北京市',
    address: '北京市东城区王府井大街',
    type: 'shopping',
    rating: 4.5,
    price: 0,
    openTime: '全天开放',
    description: '北京最繁华的商业街之一，集购物、美食、娱乐于一体。',
    images: ['https://picsum.photos/seed/tuji106/800/600'],
    latitude: 39.9173,
    longitude: 116.4095,
  },
  {
    id: '6',
    name: '颐和园',
    city: '北京',
    province: '北京市',
    address: '北京市海淀区新建宫门路19号',
    type: 'scenic',
    rating: 4.8,
    price: 30,
    openTime: '06:00-20:00',
    description: '中国现存最大的皇家园林，集江南园林精华于一身。',
    images: ['https://picsum.photos/seed/tuji107/800/600'],
    latitude: 39.9999,
    longitude: 116.2708,
  },
  {
    id: '7',
    name: '北京王府半岛酒店',
    city: '北京',
    province: '北京市',
    address: '北京市东城区王府井金宝街8号',
    type: 'hotel',
    rating: 4.9,
    price: 1500,
    openTime: '全天',
    description: '五星级酒店，位于王府井商业区，交通便利，服务一流。',
    images: ['https://picsum.photos/seed/tuji108/800/600'],
    latitude: 39.9175,
    longitude: 116.4130,
  },
  // 上海
  {
    id: '8',
    name: '外滩',
    city: '上海',
    province: '上海市',
    address: '上海市黄浦区中山东一路',
    type: 'scenic',
    rating: 4.8,
    price: 0,
    openTime: '全天开放',
    description: '上海最具代表性的景观，可欣赏陆家嘴天际线夜景。',
    images: ['https://picsum.photos/seed/tuji201/800/600'],
    latitude: 31.2397,
    longitude: 121.4998,
  },
  {
    id: '9',
    name: '东方明珠广播电视塔',
    city: '上海',
    province: '上海市',
    address: '上海市浦东新区世纪大道1号',
    type: 'scenic',
    rating: 4.6,
    price: 199,
    openTime: '09:00-21:00',
    description: '上海标志性建筑，可360度俯瞰上海全景。',
    images: ['https://picsum.photos/seed/tuji202/800/600'],
    latitude: 31.2397,
    longitude: 121.4998,
  },
  {
    id: '10',
    name: '南翔小笼包',
    city: '上海',
    province: '上海市',
    address: '上海市黄浦区豫园路85号',
    type: 'food',
    rating: 4.5,
    price: 80,
    openTime: '08:00-21:00',
    description: '上海传统名点，皮薄汁多，鲜美可口。',
    images: ['https://picsum.photos/seed/tuji203/800/600'],
    latitude: 31.2273,
    longitude: 121.4920,
  },
  {
    id: '11',
    name: '南京路步行街',
    city: '上海',
    province: '上海市',
    address: '上海市黄浦区南京东路',
    type: 'shopping',
    rating: 4.6,
    price: 0,
    openTime: '全天开放',
    description: '中华商业第一街，汇集众多老字号和国际品牌。',
    images: ['https://picsum.photos/seed/tuji204/800/600'],
    latitude: 31.2335,
    longitude: 121.4737,
  },
  // 成都
  {
    id: '12',
    name: '宽窄巷子',
    city: '成都',
    province: '四川省',
    address: '成都市青羊区长顺上街127号',
    type: 'scenic',
    rating: 4.5,
    price: 0,
    openTime: '全天开放',
    description: '成都最具代表性的历史文化街区，美食与文化的完美结合。',
    images: ['https://picsum.photos/seed/tuji301/800/600'],
    latitude: 30.6634,
    longitude: 104.0571,
  },
  {
    id: '13',
    name: '成都大熊猫繁育研究基地',
    city: '成都',
    province: '四川省',
    address: '成都市成华区熊猫大道1375号',
    type: 'scenic',
    rating: 4.9,
    price: 55,
    openTime: '07:30-18:00',
    description: '近距离观看可爱的大熊猫，亲子游必去。',
    images: ['https://picsum.photos/seed/tuji302/800/600'],
    latitude: 30.7342,
    longitude: 104.1471,
  },
  {
    id: '14',
    name: '蜀大侠火锅',
    city: '成都',
    province: '四川省',
    address: '成都市锦江区春熙路',
    type: 'food',
    rating: 4.7,
    price: 120,
    openTime: '10:00-02:00',
    description: '正宗成都老火锅，麻辣鲜香，回味无穷。',
    images: ['https://picsum.photos/seed/tuji303/800/600'],
    latitude: 30.6574,
    longitude: 104.0815,
  },
  {
    id: '15',
    name: '锦里古街',
    city: '成都',
    province: '四川省',
    address: '成都市武侯区武侯祠大街231号',
    type: 'scenic',
    rating: 4.4,
    price: 0,
    openTime: '全天开放',
    description: '西蜀最古老、最具商业气息的街道之一。',
    images: ['https://picsum.photos/seed/tuji304/800/600'],
    latitude: 30.6424,
    longitude: 104.0443,
  },
  // 杭州
  {
    id: '16',
    name: '西湖',
    city: '杭州',
    province: '浙江省',
    address: '杭州市西湖区龙井路1号',
    type: 'scenic',
    rating: 4.9,
    price: 0,
    openTime: '全天开放',
    description: '中国十大风景名胜之一，以秀丽的湖光山色闻名。',
    images: ['https://picsum.photos/seed/tuji401/800/600'],
    latitude: 30.2489,
    longitude: 120.1469,
  },
  {
    id: '17',
    name: '灵隐寺',
    city: '杭州',
    province: '浙江省',
    address: '杭州市西湖区灵隐路法云弄1号',
    type: 'scenic',
    rating: 4.7,
    price: 45,
    openTime: '07:00-18:15',
    description: '江南著名古刹，佛教圣地，环境清幽。',
    images: ['https://picsum.photos/seed/tuji402/800/600'],
    latitude: 30.2406,
    longitude: 120.0988,
  },
  {
    id: '18',
    name: '西湖醋鱼',
    city: '杭州',
    province: '浙江省',
    address: '杭州市上城区延安路',
    type: 'food',
    rating: 4.4,
    price: 150,
    openTime: '10:00-21:00',
    description: '杭州传统名菜，鱼肉鲜嫩，酸甜适口。',
    images: ['https://picsum.photos/seed/tuji403/800/600'],
    latitude: 30.2554,
    longitude: 120.1636,
  },
  {
    id: '19',
    name: '龙井茶园',
    city: '杭州',
    province: '浙江省',
    address: '杭州市西湖区龙井村',
    type: 'scenic',
    rating: 4.6,
    price: 0,
    openTime: '全天开放',
    description: '中国十大名茶之一龙井茶的产地，风景优美。',
    images: ['https://picsum.photos/seed/tuji404/800/600'],
    latitude: 30.2194,
    longitude: 120.1134,
  },
  // 西安
  {
    id: '20',
    name: '秦始皇兵马俑博物馆',
    city: '西安',
    province: '陕西省',
    address: '西安市临潼区秦陵北路',
    type: 'scenic',
    rating: 4.9,
    price: 120,
    openTime: '08:30-17:00',
    description: '世界第八大奇迹，秦始皇陵陪葬坑，震撼人心。',
    images: ['https://picsum.photos/seed/tuji501/800/600'],
    latitude: 34.3841,
    longitude: 109.2785,
  },
  {
    id: '21',
    name: '大雁塔',
    city: '西安',
    province: '陕西省',
    address: '西安市雁塔区雁塔南路',
    type: 'scenic',
    rating: 4.7,
    price: 40,
    openTime: '08:00-17:30',
    description: '唐代佛教建筑艺术杰作，西安标志性建筑。',
    images: ['https://picsum.photos/seed/tuji502/800/600'],
    latitude: 34.2204,
    longitude: 108.9686,
  },
  {
    id: '22',
    name: '回民街',
    city: '西安',
    province: '陕西省',
    address: '西安市莲湖区北院门',
    type: 'food',
    rating: 4.5,
    price: 60,
    openTime: '全天开放',
    description: '西安著名美食街区，肉夹馍、羊肉泡馍应有尽有。',
    images: ['https://picsum.photos/seed/tuji503/800/600'],
    latitude: 34.2628,
    longitude: 108.9402,
  },
  {
    id: '23',
    name: '华清宫',
    city: '西安',
    province: '陕西省',
    address: '西安市临潼区华清路38号',
    type: 'scenic',
    rating: 4.6,
    price: 120,
    openTime: '07:30-18:00',
    description: '唐代皇家温泉宫殿，唐玄宗与杨贵妃的爱情故事发生地。',
    images: ['https://picsum.photos/seed/tuji504/800/600'],
    latitude: 34.3634,
    longitude: 109.2104,
  },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    name: '北京文化之旅',
    destination: '北京',
    days: 4,
    nights: 3,
    people: 2,
    startDate: '2026-07-15',
    status: 'planning',
    coverImage: 'https://picsum.photos/seed/tuji109/800/600',
    createdAt: '2026-06-20',
    pois: [],
  },
  {
    id: '2',
    name: '上海周末游',
    destination: '上海',
    days: 3,
    nights: 2,
    people: 1,
    startDate: '2026-08-01',
    status: 'planning',
    coverImage: 'https://picsum.photos/seed/tuji110/800/600',
    createdAt: '2026-06-25',
    pois: [],
  },
];

export const mockDaySchedules: DaySchedule[] = [
  {
    id: '1',
    tripId: '1',
    dayIndex: 1,
    date: '2026-07-15',
    items: [
      {
        id: '1-1',
        poiId: '1',
        poi: mockPOIs[0],
        startTime: '09:00',
        endTime: '12:00',
        type: 'scenic',
      },
      {
        id: '1-2',
        poiId: '3',
        poi: mockPOIs[2],
        startTime: '12:30',
        endTime: '14:00',
        type: 'food',
      },
      {
        id: '1-3',
        poiId: '4',
        poi: mockPOIs[3],
        startTime: '15:00',
        endTime: '18:00',
        type: 'scenic',
      },
    ],
  },
  {
    id: '2',
    tripId: '1',
    dayIndex: 2,
    date: '2026-07-16',
    items: [
      {
        id: '2-1',
        poiId: '2',
        poi: mockPOIs[1],
        startTime: '08:00',
        endTime: '14:00',
        type: 'scenic',
      },
      {
        id: '2-2',
        poiId: '5',
        poi: mockPOIs[4],
        startTime: '16:00',
        endTime: '19:00',
        type: 'shopping',
      },
    ],
  },
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    tripId: '1',
    totalBudget: 5000,
    transportation: 1000,
    accommodation: 1500,
    food: 1000,
    ticket: 500,
    shopping: 500,
    other: 500,
  },
];

export const mockExpenses: Expense[] = [
  { id: '1', tripId: '1', category: 'transportation', amount: 450, date: '2026-07-15', note: '机票' },
  { id: '2', tripId: '1', category: 'accommodation', amount: 600, date: '2026-07-15', note: '酒店押金' },
  { id: '3', tripId: '1', category: 'food', amount: 200, date: '2026-07-15', note: '午餐' },
  { id: '4', tripId: '1', category: 'ticket', amount: 120, date: '2026-07-15', note: '故宫门票' },
];

export const hotCities = [
  { id: '1', name: '北京', province: '北京市', image: 'https://picsum.photos/seed/tuji111/400/300' },
  { id: '2', name: '上海', province: '上海市', image: 'https://picsum.photos/seed/tuji112/400/300' },
  { id: '3', name: '成都', province: '四川省', image: 'https://picsum.photos/seed/tuji113/400/300' },
  { id: '4', name: '杭州', province: '浙江省', image: 'https://picsum.photos/seed/tuji114/400/300' },
  { id: '5', name: '西安', province: '陕西省', image: 'https://picsum.photos/seed/tuji115/400/300' },
];

export const travelPreferences = [
  { id: '1', name: '自然风光', icon: 'Mountain', color: 'text-green-500' },
  { id: '2', name: '历史文化', icon: 'Building', color: 'text-amber-500' },
  { id: '3', name: '美食探店', icon: 'Utensils', color: 'text-red-500' },
  { id: '4', name: '城市漫步', icon: 'MapPin', color: 'text-blue-500' },
  { id: '5', name: '亲子乐园', icon: 'Baby', color: 'text-pink-500' },
  { id: '6', name: '购物娱乐', icon: 'ShoppingBag', color: 'text-purple-500' },
];

export const userGuides: Guide[] = [
  {
    id: '1',
    title: '北京4天3晚深度游攻略',
    author: '旅行达人小王',
    avatar: '王',
    image: 'https://picsum.photos/seed/tuji116/800/600',
    likes: 1256,
    views: 8934,
    days: 4,
    nights: 3,
    destination: '北京',
    province: '北京市',
    budget: 3000,
    people: 2,
    description: '本次北京之旅，我们将带你探访故宫、长城、天坛等著名景点，品尝正宗北京烤鸭，体验老北京胡同文化。行程安排合理，适合首次来京的游客。',
    pois: ['故宫博物院', '八达岭长城', '天坛公园'],
    poiDetails: [
      {
        name: '故宫博物院',
        type: 'scenic',
        duration: '3小时',
        price: 60,
        description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
        image: 'https://picsum.photos/seed/tuji120/800/600',
      },
      {
        name: '八达岭长城',
        type: 'scenic',
        duration: '4小时',
        price: 45,
        description: '万里长城的代表段落之一，是明长城中保存最完整的一段。',
        image: 'https://picsum.photos/seed/tuji121/800/600',
      },
      {
        name: '北京烤鸭店',
        type: 'food',
        duration: '1.5小时',
        price: 200,
        description: '正宗北京烤鸭，皮脆肉嫩，香气四溢。',
        image: 'https://picsum.photos/seed/tuji122/800/600',
      },
      {
        name: '天坛公园',
        type: 'scenic',
        duration: '2小时',
        price: 34,
        description: '明清两代帝王祭天、祈谷的场所，建筑宏伟壮观。',
        image: 'https://picsum.photos/seed/tuji123/800/600',
      },
    ],
  },
  {
    id: '2',
    title: '上海迪士尼亲子游全攻略',
    author: '妈妈爱旅行',
    avatar: '妈',
    image: 'https://picsum.photos/seed/tuji117/800/600',
    likes: 892,
    views: 5621,
    days: 3,
    nights: 2,
    destination: '上海',
    province: '上海市',
    budget: 4000,
    people: 3,
    description: '带娃玩转上海迪士尼，最全攻略来袭！包含必玩项目、餐饮推荐和省时技巧。',
    pois: ['迪士尼乐园', '外滩', '南京路'],
    poiDetails: [
      {
        name: '上海迪士尼乐园',
        type: 'scenic',
        duration: '全天',
        price: 435,
        description: '中国内地首座迪士尼主题乐园，拥有七大主题园区。',
        image: 'https://picsum.photos/seed/tuji127/800/600',
      },
      {
        name: '外滩',
        type: 'scenic',
        duration: '2小时',
        price: 0,
        description: '上海最具代表性的景观，可欣赏陆家嘴天际线夜景。',
        image: 'https://picsum.photos/seed/tuji125/800/600',
      },
    ],
  },
  {
    id: '3',
    title: '成都美食探店之旅',
    author: '吃货小李',
    avatar: '李',
    image: 'https://picsum.photos/seed/tuji118/800/600',
    likes: 2341,
    views: 12567,
    days: 5,
    nights: 4,
    destination: '成都',
    province: '四川省',
    budget: 2500,
    people: 2,
    description: '成都5天吃遍大街小巷，火锅、串串、担担面，让你吃到爽！',
    pois: ['宽窄巷子', '锦里', '熊猫基地'],
    poiDetails: [
      {
        name: '宽窄巷子',
        type: 'scenic',
        duration: '2小时',
        price: 0,
        description: '成都最具代表性的历史文化街区，美食与文化的完美结合。',
        image: 'https://picsum.photos/seed/tuji128/800/600',
      },
      {
        name: '成都大熊猫繁育研究基地',
        type: 'scenic',
        duration: '3小时',
        price: 55,
        description: '近距离观看可爱的大熊猫，亲子游必去。',
        image: 'https://picsum.photos/seed/tuji129/800/600',
      },
    ],
  },
  {
    id: '4',
    title: '杭州西湖浪漫两日游',
    author: '江南烟雨',
    avatar: '江',
    image: 'https://picsum.photos/seed/tuji130/800/600',
    likes: 1567,
    views: 8234,
    days: 2,
    nights: 1,
    destination: '杭州',
    province: '浙江省',
    budget: 1800,
    people: 2,
    description: '漫步西湖十景，品味龙井茶香，感受江南水乡的诗意与浪漫。',
    pois: ['西湖', '灵隐寺', '龙井茶园'],
    poiDetails: [
      {
        name: '西湖',
        type: 'scenic',
        duration: '4小时',
        price: 0,
        description: '中国十大风景名胜之一，以秀丽的湖光山色闻名。',
        image: 'https://picsum.photos/seed/tuji131/800/600',
      },
      {
        name: '灵隐寺',
        type: 'scenic',
        duration: '2小时',
        price: 45,
        description: '江南著名古刹，佛教圣地，环境清幽。',
        image: 'https://picsum.photos/seed/tuji132/800/600',
      },
    ],
  },
  {
    id: '5',
    title: '西安古都历史穿越之旅',
    author: '历史迷老张',
    avatar: '张',
    image: 'https://picsum.photos/seed/tuji133/800/600',
    likes: 3102,
    views: 15678,
    days: 4,
    nights: 3,
    destination: '西安',
    province: '陕西省',
    budget: 2800,
    people: 2,
    description: '从兵马俑到古城墙，穿越千年历史，品味关中美食，感受十三朝古都的魅力。',
    pois: ['兵马俑', '大雁塔', '回民街'],
    poiDetails: [
      {
        name: '秦始皇兵马俑博物馆',
        type: 'scenic',
        duration: '3小时',
        price: 120,
        description: '世界第八大奇迹，秦始皇陵陪葬坑，震撼人心。',
        image: 'https://picsum.photos/seed/tuji134/800/600',
      },
      {
        name: '大雁塔',
        type: 'scenic',
        duration: '1.5小时',
        price: 40,
        description: '唐代佛教建筑艺术杰作，西安标志性建筑。',
        image: 'https://picsum.photos/seed/tuji135/800/600',
      },
    ],
  },
];
