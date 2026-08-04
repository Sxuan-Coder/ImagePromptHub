import type { PromptItem, SourceMeta, SourceSlug } from '../types'
import { classifyCase, CATEGORIES, OTHER_CATEGORY } from './categories'
import type { Case } from '../types'

/**
 * Native-category → unified-slug mapping. The five upstream repos each use
 * their own taxonomy; we collapse them onto the gallery's category set plus
 * a few extra slugs (`anime`, `3d`) that recur too often to bucket as
 * "other". Anything unmapped falls through to the keyword classifier.
 */
const NATIVE_MAP: Record<string, string> = {
  // davidwu
  advertising: 'product',
  portrait: 'character',
  '3d_cute': '3d',
  scene: 'scene',
  '3d_render': '3d',
  creative: 'illustration',
  product: 'product',
  illustration: 'illustration',
  text_render: 'poster',
  poster: 'poster',
  card: 'character',
  food: 'photo',
  logo: 'brand',
  ui: 'ui',
  architecture: 'architecture',
  infographic: 'infographic',
  character: 'character',
  photography: 'photo',
  other: 'other',
  ancient: 'history',
  '3d': '3d',
  document: 'infographic',
  anime: 'anime',
  anime_illustration: 'anime',
  product_poster: 'product',
  game_ui: 'ui',
  illustration_map: 'illustration',
  social_poster: 'poster',
  // youmind-style section names (kept here as canonical Chinese labels)
  cinematic: 'scene',

  // youmind (urls/labels) — handled by keyword fallback mostly
  youmind: '',
}

/**
 * Extra categories introduced for the multi-source set. Kept minimal so the
 * existing FilterBar logic still works; they are appended after the base set.
 */
export const EXTRA_CATEGORIES = [
  {
    slug: '3d',
    label: '3D 渲染',
    desc: '手办、潮玩、3D 渲染、材质与立体场景',
    icon: '🧊',
    keywords: ['3d', '手办', '潮玩', '盲盒', '渲染', '材质', '黏土', 'clay', 'figure', '玩具'],
  },
  {
    slug: 'anime',
    label: '动漫插画',
    desc: '动漫风格、二次元角色与插画',
    icon: '🌸',
    keywords: ['动漫', 'anime', '二次元', '漫画', 'manga', '插画', '日系', '宫崎骏'],
  },
] as const

/** Sections of the zerolu README, mapped to a unified slug. */
const ZEROLU_SECTION_MAP: Record<string, string> = {
  摄影与照片级写实: 'photo',
  游戏与娱乐: 'scene',
  'UI / UX 与社交媒体': 'ui',
  'UI/UX 与社交媒体': 'ui',
  '视频、动画与拼贴': 'scene',
  '字体排版与海报设计': 'poster',
  '信息图、教育与文档': 'infographic',
  '角色与一致性': 'character',
  '图像编辑与风格迁移': 'illustration',
  资源: 'other',
  贡献: 'other',
}

/** Classify a prompt item into a single unified category slug. */
export function classifyPrompt(item: PromptItem): string {
  const native = item.nativeCategory

  // 1. Direct native → unified map (davidwu native slugs).
  if (native && NATIVE_MAP[native]) return NATIVE_MAP[native]

  // 2. zerolu section headers (Chinese, may carry a stray emoji byte).
  if (item.collection === 'zerolu' && native) {
    const cleaned = native.replace(/[^\u4e00-\u9fffA-Za-z /]+/g, '').trim()
    if (ZEROLU_SECTION_MAP[cleaned]) return ZEROLU_SECTION_MAP[cleaned]
  }

  // 3. Keyword classification over title + prompt (reuses the Case classifier).
  const asCase = {
    id: 0,
    title: item.title,
    image: item.image,
    source: item.author ?? '',
    prompt: item.prompt,
  } as Case
  const kw = classifyCase(asCase)
  if (kw !== 'other') return kw

  // 4. Extra-category keyword pass (3d / anime).
  const hay = `${item.title} ${item.titleEn ?? ''} ${item.prompt}`.toLowerCase()
  for (const cat of EXTRA_CATEGORIES) {
    if (cat.keywords.some((k) => hay.includes(k.toLowerCase()))) return cat.slug
  }

  return OTHER_CATEGORY.slug
}

/**
 * Full ordered category list for the prompts gallery: base categories first,
 * then the extras (3d / anime), then "other".
 */
export function getPromptCategories() {
  return [
    ...CATEGORIES,
    ...EXTRA_CATEGORIES.map((c) => ({ ...c, keywords: [...c.keywords] })),
    OTHER_CATEGORY,
  ]
}

/** Display metadata for each upstream source. */
export const SOURCES: Record<SourceSlug, SourceMeta> = {
  davidwu: {
    slug: 'davidwu',
    label: 'davidwu 精选',
    repo: 'davidwuw0811-boop/awesome-gpt-image2-prompts',
    repoUrl: 'https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts',
    file: 'prompts.json',
    icon: '🎨',
    desc: '结构化 JSON，含中英标题、作者与分类',
  },
  zerolu: {
    slug: 'zerolu',
    label: 'awesome-gpt-image',
    repo: 'ZeroLu/awesome-gpt-image',
    repoUrl: 'https://github.com/ZeroLu/awesome-gpt-image',
    file: 'README.zh-CN.md',
    icon: '📷',
    desc: 'GPT Image 2 社区高保真提示词合集',
  },
  imgedify: {
    slug: 'imgedify',
    label: 'GPT4o Prompts',
    repo: 'ImgEdify/Awesome-GPT4o-Image-Prompts',
    repoUrl: 'https://github.com/ImgEdify/Awesome-GPT4o-Image-Prompts',
    file: 'README.zh-CN.md',
    icon: '✨',
    desc: 'GPT-4o 图像生成提示词集合',
  },
  'youmind-gpt-image-2': {
    slug: 'youmind-gpt-image-2',
    label: 'YouMind GPT Image 2',
    repo: 'YouMind-OpenLab/awesome-gpt-image-2',
    repoUrl: 'https://github.com/YouMind-OpenLab/awesome-gpt-image-2',
    file: 'README_zh.md',
    icon: '🚀',
    desc: 'GPT Image 2 创意提示词精选，每日更新',
  },
  'youmind-nano-banana': {
    slug: 'youmind-nano-banana',
    label: 'YouMind Nano Banana',
    repo: 'YouMind-OpenLab/awesome-nano-banana-pro-prompts',
    repoUrl: 'https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts',
    file: 'README_zh.md',
    icon: '🍌',
    desc: 'Google Nano Banana Pro 创意提示词精选',
  },
}

export const SOURCE_LIST: SourceMeta[] = Object.values(SOURCES)
