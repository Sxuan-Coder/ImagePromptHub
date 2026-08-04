# ImagePromptHub · AI 图像提示词画廊

一个展示 AI 生成图片及其原始提示词的 React 画廊网站。精选 **517 个** GPT Image 2 案例，外加来自 5 大开源仓库的 **864 条**多源生图提示词，每个都附带完整可复制的提示词。

## ✨ 特性

- **案例画廊**（`/`）：517 个 freestylefly 案例，响应式卡片网格，懒加载图片，悬停预览
- **多源提示词库**（`/prompts`）：聚合 5 个 GitHub 仓库的 864 条提示词，每日自动增量更新
- **智能分类**：14 大类（UI、信息图、海报、电商、品牌、建筑、人物、场景、国风、摄影、插画、3D、动漫、其他），按关键词 + 源原生分类自动归类
- **多维搜索**：按标题、提示词、作者、来源搜索
- **详情页**：大图 + 多图轮播 + 中英文分段提示词 + 作者/参考图标识 + 一键复制
- **增量更新**：基于 prompt 指纹去重，GitHub Actions 每日自动同步新条目并提交
- **响应式**：移动端单列 → 桌面四列，分类标签横向滚动
- **零后端**：构建期解析数据，纯静态部署

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

# 手动增量更新多源提示词库
npm run fetch:prompts
```

开发服务器默认运行在 `http://localhost:5173/`。

## 🔄 提示词库自动更新

提示词库数据（`src/data/prompts.json`）通过 GitHub Actions **每日自动增量更新**：

- **触发方式**：每天 UTC 01:00（北京 09:00）定时 + Actions 页面手动触发
- **增量逻辑**：基于 prompt 指纹（前 80 字 SHA-1）去重，只追加本地没有的新条目
- **ETag 缓存**：源未变化时跳过下载，减少 API 调用
- **自动提交**：有新数据时 workflow 自动 commit 并 push 回仓库

手动更新：`npm run fetch:prompts`，或访问仓库的 **Actions → Fetch Prompts → Run workflow**。

Workflow 定义见 [`.github/workflows/fetch-prompts.yml`](.github/workflows/fetch-prompts.yml)。

## 🚢 自动部署到服务器

数据更新后，GitHub Actions 会**自动构建并通过 rsync 推送 `dist/` 到服务器 nginx**，全程无需服务器主动拉取：

```
定时拉取提示词 → commit 回仓库 → 自动触发 Deploy workflow → build → rsync 推送到服务器
```

部署流程依赖在仓库 **Settings → Secrets** 中配置 `DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_PATH` / `DEPLOY_SSH_KEY` / `DEPLOY_PORT`。

👉 **完整配置步骤（SSH 密钥生成、nginx 配置、Secrets 填写、故障排查）见 [部署指南](docs/DEPLOY.md)**。

Workflow 定义见 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)。

## 📁 项目结构

```
ImagePromptHub/
├── scripts/
│   ├── parse-cases.mjs            # 案例画廊数据解析 → src/data/cases.json
│   ├── fetch-prompts.mjs          # 多源提示词库增量抓取主入口
│   └── prompts/
│       ├── lib/                    # hash / store / normalize 工具
│       └── sources/                # davidwu / zerolu / imgedify / youmind 解析器
├── .github/workflows/
│   └── fetch-prompts.yml          # 每日自动增量更新 workflow
├── src/
│   ├── data/
│   │   ├── cases.json             # 案例画廊数据（构建期生成）
│   │   ├── prompts.json           # 多源提示词库数据（fetch:prompts 增量生成）
│   │   └── prompts-manifest.json  # 抓取元信息（时间/各源计数）
│   ├── types.ts                   # TypeScript 类型（Case / PromptItem）
│   ├── lib/
│   │   ├── cases.ts               # 案例数据访问与分类
│   │   ├── prompts.ts             # 提示词库数据访问与统计
│   │   ├── categories.ts          # 案例分类定义
│   │   └── prompt-categories.ts   # 提示词库分类映射（源原生 → 统一 slug）
│   ├── hooks/                     # useCopy / useImageLoad / useGalleryFilters / usePromptFilters
│   ├── components/                # Header, Hero, FilterBar, CaseCard, PromptCard, PromptBlock…
│   ├── pages/                     # GalleryPage, CaseDetailPage, PromptsGalleryPage, PromptDetailPage
│   ├── App.tsx, main.tsx, index.css
├── index.html, vite.config.ts, tailwind.config.js, tsconfig.json
```

## 📊 数据源

**案例画廊**：
- [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)

**多源提示词库**：
- [davidwuw0811-boop/awesome-gpt-image2-prompts](https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts)
- [ZeroLu/awesome-gpt-image](https://github.com/ZeroLu/awesome-gpt-image)
- [ImgEdify/Awesome-GPT4o-Image-Prompts](https://github.com/ImgEdify/Awesome-GPT4o-Image-Prompts)
- [YouMind-OpenLab/awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2)
- [YouMind-OpenLab/awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)


## 📝 许可

代码采用 MIT 许可。图片与提示词版权归原作者所有。
