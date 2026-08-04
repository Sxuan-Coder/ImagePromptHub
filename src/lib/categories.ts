import type { Case, Category } from '../types'

/**
 * Category taxonomy. Derived from the 11 case-album groups in the source
 * repository README. Cases are auto-classified by matching keywords against
 * their title + prompt, because the source markdown carries no explicit tags.
 *
 * Order matters: earlier categories take priority when several match, so the
 * more specific ones (UI, poster, brand...) are listed before the broad
 * "photography" / "illustration" buckets.
 */
export const CATEGORIES: Category[] = [
  {
    slug: 'ui',
    label: 'UI 与界面',
    desc: 'App、网站、后台、社媒截图与产品界面',
    icon: '🧩',
    keywords: [
      '界面', 'ui', '网页', '网站', 'dashboard', '后台', '仪表盘', '样机',
      '截图', 'mockup', '界面设计', '交互设计', '中控', 'app', '登录页',
      'landing', '导航', '聊天气泡', '朋友圈', '微博', '微信', '直播',
    ],
  },
  {
    slug: 'infographic',
    label: '图表信息图',
    desc: '信息图、知识地图、技术图解与结构化图表',
    icon: '📊',
    keywords: [
      '信息图', 'infographic', '可视化', '图谱', '图解', '知识图', '解剖图',
      '矩阵图', '流程图', '思维导图', '对照表', '图鉴', '说明书',
    ],
  },
  {
    slug: 'poster',
    label: '海报排版',
    desc: '活动海报、封面、字体驱动与强版式构图',
    icon: '📰',
    keywords: [
      '海报', 'poster', '排版', '版式', '封面', '字体', 'typography',
      '排版设计', '主视觉', 'key visual', '封面设计', '宣传图',
    ],
  },
  {
    slug: 'product',
    label: '产品电商',
    desc: '产品图、详情页、包装、卖点与广告',
    icon: '🛍️',
    keywords: [
      '电商', '详情页', '商品', '产品展示', '包装', '广告', '卖点',
      'product', 'e-commerce', '详情图', '展示图', '商品展示', '电商详情',
      '咖啡机', '蛋白粉',
    ],
  },
  {
    slug: 'brand',
    label: '品牌徽标',
    desc: 'Logo、识别系统、品牌触点与活动视觉',
    icon: '🏷️',
    keywords: [
      '品牌', 'logo', '徽标', '标识', 'vi', '识别', '品牌视觉', 'brand',
    ],
  },
  {
    slug: 'architecture',
    label: '建筑空间',
    desc: '建筑效果图、室内、城市地图与空间概念',
    icon: '🏛️',
    keywords: [
      '建筑', '室内', '空间', 'architecture', '效果图', '室内设计', '城市',
      '场景图',
    ],
  },
  {
    slug: 'character',
    label: '人物角色',
    desc: '角色设计、姿态参考、卡牌与 3D 玩具',
    icon: '🧍',
    keywords: [
      '人物', '角色', 'character', '卡牌', '人偶', '盲盒', '手办', '3d玩具',
      '角色设定', '头像', '人像',
    ],
  },
  {
    slug: 'scene',
    label: '场景叙事',
    desc: '分镜、叙事场景、直播帧与世界观构建',
    icon: '🎬',
    keywords: [
      '分镜', '叙事', '场景', 'storyboard', '故事板', '世界观', '叙事场景',
      '电影感', '校园喜剧', '故事',
    ],
  },
  {
    slug: 'history',
    label: '历史国风',
    desc: '历史人物、古典中国主题与水墨工笔',
    icon: '🏮',
    keywords: [
      '水墨', '工笔', '唐朝', '宋朝', '唐朝贵妇', '国风', '古典', '历史',
      '苏轼', '杜甫', '武则天', '玄武门', '观音', '圣斗士', '桃太郎',
    ],
  },
  {
    slug: 'photo',
    label: '摄影写实',
    desc: '人像、手机摄影、胶片质感与商业摄影',
    icon: '📷',
    keywords: [
      '写实', '摄影', 'photo', '写真', '肖像', '人像摄影', '写实摄影',
      '商业摄影', '超写实', '氛围感', '镜头', '光圈',
    ],
  },
  {
    slug: 'illustration',
    label: '插画艺术',
    desc: '插画、艺术风格、材质实验与装饰图',
    icon: '🎨',
    keywords: [
      '插画', 'illustration', '艺术', 'art', '风格创作', '创作图', '涂鸦',
      '插画艺术', '艺术创作', '超现实', '梦幻',
    ],
  },
]

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
)

/** "All" pseudo-category slug used as the default filter. */
export const ALL_CATEGORY = 'all'

/**
 * Classify a case into a single category. Returns the slug of the first
 * matching category (priority order), or 'other' if nothing matches.
 */
export function classifyCase(c: Case): string {
  const haystack = `${c.title} ${c.prompt}`.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => haystack.includes(kw.toLowerCase()))) {
      return cat.slug
    }
  }
  return 'other'
}

export const OTHER_CATEGORY: Category = {
  slug: 'other',
  label: '其他',
  desc: '未归类的创意案例',
  icon: '✨',
  keywords: [],
}

/** All categories including the "other" bucket, for filter display. */
export const ALL_FILTER_CATEGORIES: Category[] = [...CATEGORIES, OTHER_CATEGORY]

export function getCategory(slug: string): Category | undefined {
  if (slug === 'other') return OTHER_CATEGORY
  return CATEGORY_MAP[slug]
}
