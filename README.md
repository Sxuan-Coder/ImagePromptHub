# ImagePromptHub · AI 图像提示词画廊

一个展示 AI 生成图片及其原始提示词的 React 画廊网站，灵感来自 [一个同类图像提示词画廊网站](一个同类图像提示词画廊网站)。精选 **517 个** GPT Image 2 案例，每个都附带完整可复制的提示词。

## ✨ 特性

- **画廊首页**：响应式瀑布卡片网格，懒加载图片，悬停预览
- **智能分类**：12 大类（UI、信息图、海报、电商、品牌、建筑、人物、场景、国风、摄影、插画、其他），按关键词自动归类
- **多维搜索**：支持按标题、提示词内容、案例编号搜索
- **详情页**：大图 + 中英文分段的完整提示词 + 一键复制 + 上下案例导航
- **一键复制**：整段或分节复制提示词，带复制反馈
- **响应式**：移动端单列 → 桌面四列，分类标签横向滚动
- **零后端**：构建期解析 Markdown 数据，纯静态部署

## 🛠 技术栈

| 工具 | 用途 |
|------|------|
| Vite + React 18 + TypeScript | 应用框架 |
| TailwindCSS | 样式 |
| react-router-dom | 路由 |
| lucide-react | 图标 |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（自动解析数据）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

开发服务器默认运行在 `http://localhost:5173/`。

## 📁 项目结构

```
ImagePromptHub/
├── scripts/parse-cases.mjs   # 构建期 Markdown 解析脚本 → src/data/cases.json
├── src/
│   ├── data/cases.json       # 解析后的案例数据（自动生成）
│   ├── types.ts              # TypeScript 类型
│   ├── lib/
│   │   ├── cases.ts          # 数据访问、提示词拆分、统计
│   │   └── categories.ts     # 分类定义与自动归类
│   ├── hooks/                # useCopy / useImageLoad / useGalleryFilters
│   ├── components/           # Header, Hero, FilterBar, CaseCard, PromptBlock…
│   ├── pages/                # GalleryPage, CaseDetailPage
│   ├── App.tsx, main.tsx, index.css
├── index.html, vite.config.ts, tailwind.config.js, tsconfig.json
```

## 📊 数据来源

图片与提示词均来自开源仓库 [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)，图片通过 GitHub raw CDN 直接加载，无需下载。版权归原作者所有，本站仅作学习展示。

解析脚本会在首次运行时下载两份 Markdown（`gallery-part-1.md` / `gallery-part-2.md`）并缓存到 `scripts/.cache/`，之后从缓存读取。

## 📝 许可

代码采用 MIT 许可。图片与提示词版权归原作者所有。
