import type { POI } from '@/store/useTripStore';

// 热门 POI 数据库
export const pois: POI[] = [
  // 北京
  {
    id: 'bj-001',
    name: '故宫博物院',
    city: '北京',
    address: '北京市东城区景山前街4号',
    type: '景点',
    rating: 4.8,
    price: 60,
    openTime: '08:30-17:00',
    description: '中国明清两代的皇家宫殿,世界上现存规模最大、保存最为完整的木质结构古建筑之一。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Forbidden%20City%20Palace%20Museum%20Beijing%20ancient%20Chinese%20architecture%20golden%20roof%20red%20walls%20grand%20palace&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Forbidden%20City%20inner%20court%20traditional%20Chinese%20palace%20architecture%20beautiful%20gardens&image_size=landscape_16_9',
    ],
    latitude: 39.9163,
    longitude: 116.3972,
  },
  {
    id: 'bj-002',
    name: '长城(八达岭)',
    city: '北京',
    address: '北京市延庆区八达岭镇',
    type: '景点',
    rating: 4.7,
    price: 40,
    openTime: '07:30-18:00',
    description: '中国古代伟大的防御工程,是万里长城的重要组成部分,被列为世界文化遗产。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Great%20Wall%20Badaling%20section%20magnificent%20ancient%20Chinese%20defense%20wall%20mountain%20scenery&image_size=landscape_16_9',
    ],
    latitude: 40.3596,
    longitude: 116.0199,
  },
  {
    id: 'bj-003',
    name: '颐和园',
    city: '北京',
    address: '北京市海淀区新建宫门路19号',
    type: '景点',
    rating: 4.6,
    price: 30,
    openTime: '06:30-18:00',
    description: '中国清朝时期皇家园林,以昆明湖、万寿山为基址,汲取江南园林的设计手法而建成。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Summer%20Palace%20Yiheyuan%20beautiful%20Chinese%20royal%20garden%20Kunming%20Lake%20Longevity%20Hill&image_size=landscape_16_9',
    ],
    latitude: 39.9999,
    longitude: 116.2755,
  },
  {
    id: 'bj-004',
    name: '天坛公园',
    city: '北京',
    address: '北京市东城区天坛内大街',
    type: '景点',
    rating: 4.5,
    price: 15,
    openTime: '06:00-21:00',
    description: '明清两代帝王祭祀皇天、祈求五谷丰登的场所,是中国现存最大的古代祭祀性建筑群。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Temple%20of%20Heaven%20Beijing%20ancient%20Chinese%20sacrificial%20architecture%20blue%20roof%20circular%20building&image_size=landscape_16_9',
    ],
    latitude: 39.8822,
    longitude: 116.4066,
  },
  {
    id: 'bj-food-001',
    name: '全聚德烤鸭店',
    city: '北京',
    address: '北京市东城区前门大街30号',
    type: '美食',
    rating: 4.4,
    price: 150,
    openTime: '11:00-21:00',
    description: '始创于1864年,以传统挂炉烤鸭闻名,是北京最著名的烤鸭品牌之一。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20roast%20duck%20Quanjude%20restaurant%20traditional%20Chinese%20cuisine%20golden%20crispy%20duck&image_size=landscape_16_9',
    ],
    latitude: 39.8917,
    longitude: 116.4041,
  },

  // 上海
  {
    id: 'sh-001',
    name: '东方明珠广播电视塔',
    city: '上海',
    address: '上海市浦东新区世纪大道1号',
    type: '景点',
    rating: 4.5,
    price: 180,
    openTime: '08:00-21:30',
    description: '上海的标志性建筑,集观光、餐饮、娱乐于一体的多功能电视塔。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Oriental%20Pearl%20Tower%20Shanghai%20iconic%20modern%20TV%20tower%20night%20view%20cityscape&image_size=landscape_16_9',
    ],
    latitude: 31.2397,
    longitude: 121.4998,
  },
  {
    id: 'sh-002',
    name: '外滩',
    city: '上海',
    address: '上海市黄浦区中山东一路',
    type: '景点',
    rating: 4.7,
    price: 0,
    openTime: '全天开放',
    description: '上海最具代表性的地标之一,汇集了不同时期、不同风格的万国建筑博览群。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Bund%20Shanghai%20historic%20architecture%20colonial%20buildings%20Huangpu%20River%20night%20view&image_size=landscape_16_9',
    ],
    latitude: 31.2400,
    longitude: 121.4900,
  },
  {
    id: 'sh-003',
    name: '迪士尼乐园',
    city: '上海',
    address: '上海市浦东新区川沙镇黄赵路310号',
    type: '景点',
    rating: 4.8,
    price: 399,
    openTime: '08:30-21:00',
    description: '中国大陆首座迪士尼主题乐园,包含七大主题园区和众多游乐设施。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20Disneyland%20theme%20park%20magical%20castle%20colorful%20attractions%20entertainment&image_size=landscape_16_9',
    ],
    latitude: 31.1434,
    longitude: 121.6570,
  },
  {
    id: 'sh-food-001',
    name: '南翔馒头店',
    city: '上海',
    address: '上海市黄浦区豫园路85号',
    type: '美食',
    rating: 4.5,
    price: 50,
    openTime: '08:00-20:00',
    description: '百年老字号小笼包店,以皮薄馅多汁丰的特色小笼包闻名。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20xiaolongbao%20steamed%20dumplings%20traditional%20Chinese%20food%20delicious%20soup%20dumplings&image_size=landscape_16_9',
    ],
    latitude: 31.2264,
    longitude: 121.4856,
  },

  // 成都
  {
    id: 'cd-001',
    name: '武侯祠',
    city: '成都',
    address: '成都市武侯区武侯祠大街231号',
    type: '景点',
    rating: 4.6,
    price: 50,
    openTime: '08:00-18:00',
    description: '纪念诸葛亮的祠堂,是中国唯一的君臣合祀祠庙,三国文化的重要遗迹。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wuhou%20Shrine%20Chengdu%20ancient%20Chinese%20temple%20Three%20Kingdoms%20culture%20traditional%20architecture&image_size=landscape_16_9',
    ],
    latitude: 30.6439,
    longitude: 104.0428,
  },
  {
    id: 'cd-002',
    name: '锦里古街',
    city: '成都',
    address: '成都市武侯区武侯祠大街231号附一号',
    type: '景点',
    rating: 4.5,
    price: 0,
    openTime: '全天开放',
    description: '成都知名的商业步行街,以三国文化和四川传统民俗为主题。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Jinli%20Ancient%20Street%20Chengdu%20traditional%20Chinese%20market%20night%20view%20red%20lanterns%20folk%20culture&image_size=landscape_16_9',
    ],
    latitude: 30.6456,
    longitude: 104.0426,
  },
  {
    id: 'cd-food-001',
    name: '蜀九香火锅',
    city: '成都',
    address: '成都市武侯区神仙树南路11号',
    type: '美食',
    rating: 4.7,
    price: 120,
    openTime: '11:00-22:00',
    description: '成都本土知名火锅品牌,以正宗川味火锅和新鲜食材著称。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu%20hot%20pot%20Sichuan%20cuisine%20spicy%20broth%20colorful%20ingredients%20traditional%20Chinese%20food&image_size=landscape_16_9',
    ],
    latitude: 30.6148,
    longitude: 104.0189,
  },

  // 杭州
  {
    id: 'hz-001',
    name: '西湖',
    city: '杭州',
    address: '杭州市西湖区',
    type: '景点',
    rating: 4.9,
    price: 0,
    openTime: '全天开放',
    description: '中国著名的风景名胜,以秀丽的湖光山色和众多的名胜古迹闻名于世。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=West%20Lake%20Hangzhou%20beautiful%20Chinese%20lake%20scenery%20willow%20trees%20boats%20Leifeng%20Pagoda&image_size=landscape_16_9',
    ],
    latitude: 30.2423,
    longitude: 120.1403,
  },
  {
    id: 'hz-002',
    name: '灵隐寺',
    city: '杭州',
    address: '杭州市西湖区灵隐路法云弄1号',
    type: '景点',
    rating: 4.6,
    price: 45,
    openTime: '07:00-18:00',
    description: '中国最早的佛教寺院之一,寺内环境清幽,古树参天,佛教文化氛围浓厚。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lingyin%20Temple%20Hangzhou%20ancient%20Buddhist%20temple%20traditional%20Chinese%20architecture%20peaceful%20atmosphere&image_size=landscape_16_9',
    ],
    latitude: 30.2389,
    longitude: 120.1008,
  },
  {
    id: 'hz-food-001',
    name: '楼外楼',
    city: '杭州',
    address: '杭州市西湖区北山街孤山路30号',
    type: '美食',
    rating: 4.5,
    price: 180,
    openTime: '11:00-21:00',
    description: '百年老字号杭帮菜馆,以西湖醋鱼、东坡肉等传统杭菜闻名。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hangzhou%20traditional%20cuisine%20Louwaitai%20restaurant%20West%20Lake%20fish%20Dongpo%20pork%20Chinese%20food&image_size=landscape_16_9',
    ],
    latitude: 30.2443,
    longitude: 120.1377,
  },

  // 西安
  {
    id: 'xa-001',
    name: '兵马俑',
    city: '西安',
    address: '西安市临潼区秦陵路',
    type: '景点',
    rating: 4.8,
    price: 120,
    openTime: '08:30-17:30',
    description: '秦始皇陵的陪葬坑,被誉为"世界第八大奇迹",是中国古代军事文化的象征。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Terracotta%20Army%20Xi%20an%20ancient%20Chinese%20warriors%20clay%20soldiers%20archaeological%20site&image_size=landscape_16_9',
    ],
    latitude: 34.3847,
    longitude: 109.2784,
  },
  {
    id: 'xa-002',
    name: '大雁塔',
    city: '西安',
    address: '西安市雁塔区雁塔路',
    type: '景点',
    rating: 4.6,
    price: 50,
    openTime: '08:00-18:00',
    description: '唐代高僧玄奘为保存由天竺带回的佛经而建造的佛塔,是中国佛教文化的重要象征。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Big%20Wild%20Goose%20Pagoda%20Xi%20an%20ancient%20Chinese%20Buddhist%20tower%20traditional%20architecture&image_size=landscape_16_9',
    ],
    latitude: 34.2186,
    longitude: 108.9644,
  },
  {
    id: 'xa-food-001',
    name: '回民街',
    city: '西安',
    address: '西安市莲湖区西大街',
    type: '美食',
    rating: 4.5,
    price: 50,
    openTime: '全天开放',
    description: '西安著名的美食街区,以各式陕西小吃和清真美食闻名。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Xi%20an%20Muslim%20Street%20traditional%20Chinese%20food%20market%20local%20snacks%20night%20view&image_size=landscape_16_9',
    ],
    latitude: 34.2656,
    longitude: 108.9523,
  },

  // 三亚
  {
    id: 'sy-001',
    name: '亚龙湾',
    city: '三亚',
    address: '三亚市吉阳区亚龙湾国家旅游度假区',
    type: '景点',
    rating: 4.7,
    price: 0,
    openTime: '全天开放',
    description: '被誉为"天下第一湾",拥有细白的沙滩和清澈的海水,是三亚最著名的海滩。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yalong%20Bay%20Sanya%20beautiful%20tropical%20beach%20white%20sand%20blue%20water%20palm%20trees&image_size=landscape_16_9',
    ],
    latitude: 18.1917,
    longitude: 109.6352,
  },
  {
    id: 'sy-002',
    name: '天涯海角',
    city: '三亚',
    address: '三亚市天涯区天涯镇',
    type: '景点',
    rating: 4.4,
    price: 81,
    openTime: '08:00-18:00',
    description: '三亚著名的海滨风景区,以奇特的海蚀地貌和浪漫的爱情传说著称。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tianya%20Haijiao%20Sanya%20romantic%20seaside%20rocks%20tropical%20beach%20scenery&image_size=landscape_16_9',
    ],
    latitude: 18.3003,
    longitude: 109.3486,
  },
];

// 根据 ID 获取 POI
export const getPOIById = (id: string): POI | undefined => {
  return pois.find((poi) => poi.id === id);
};

// 根据城市获取 POI
export const getPOIsByCity = (city: string): POI[] => {
  return pois.filter((poi) => poi.city === city);
};

// 根据类型获取 POI
export const getPOIsByType = (type: string): POI[] => {
  return pois.filter((poi) => poi.type === type);
};

// 搜索 POI
export const searchPOIs = (keyword: string): POI[] => {
  const lowerKeyword = keyword.toLowerCase();
  return pois.filter(
    (poi) =>
      poi.name.toLowerCase().includes(lowerKeyword) ||
      poi.city.toLowerCase().includes(lowerKeyword) ||
      poi.description.toLowerCase().includes(lowerKeyword)
  );
};

// 获取热门 POI
export const getHotPOIs = (limit = 10): POI[] => {
  return [...pois].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

// 城市数据
export const cities = [
  { name: '北京', pois: pois.filter((p) => p.city === '北京').length, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20cityscape%20Forbidden%20City%20modern%20and%20traditional%20architecture&image_size=landscape_16_9' },
  { name: '上海', pois: pois.filter((p) => p.city === '上海').length, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shanghai%20modern%20city%20Oriental%20Pearl%20Tower%20skyscrapers%20night%20view&image_size=landscape_16_9' },
  { name: '成都', pois: pois.filter((p) => p.city === '成都').length, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu%20traditional%20Chinese%20city%20ancient%20architecture%20modern%20buildings&image_size=landscape_16_9' },
  { name: '杭州', pois: pois.filter((p) => p.city === '杭州').length, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hangzhou%20West%20Lake%20scenery%20traditional%20Chinese%20garden%20city&image_size=landscape_16_9' },
  { name: '西安', pois: pois.filter((p) => p.city === '西安').length, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Xi%20an%20ancient%20Chinese%20city%20historic%20architecture%20Bell%20Tower&image_size=landscape_16_9' },
  { name: '三亚', pois: pois.filter((p) => p.city === '三亚').length, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sanya%20tropical%20beach%20paradise%20blue%20sea%20palm%20trees&image_size=landscape_16_9' },
];

export default pois;