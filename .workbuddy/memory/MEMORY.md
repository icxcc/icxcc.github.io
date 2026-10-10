# my-blog 项目长期笔记

## 站点信息

- 中文名：**字节生活**，英文名：**ByteLife**
- 域名：https://blog.icxcc.com（`config.ts` 的 `hostname`）
- 仓库：`icxcc/icxcc.github.io`
- 描述：记录技术、笔记与生活/ Writing about code, notes and life
- logo：`docs/.vuepress/public/images/logo.svg`，深蓝底(#1e3a8a) + 书本/咖啡杯，
  蓝`#38bdf8`、黄 `#fbbf24` 为点缀色

## 技术栈

- VuePress 2 (`2.0.0-rc.31`) + vuepress-theme-plume (`1.0.0-rc.213`)
- 包管理**只用 pnpm**（本机 npm 装不上）
- 构建：`pnpm docs:build`（约 45~90s），预览：`pnpm docs:dev`（端口 8888）

## 目录约定

- 集合配置文件：`docs/.vuepress/collections.ts`（**需要重启**才生效，不放 plume.config.ts）
- 热更新配置：`docs/.vuepress/plume.config.ts`
- collections 必须写在 `config.ts` 的 theme 里，并在 `locales['/en/']` 单独配英文版

## collections 配置要点（plume ≥ rc.165）

- `type: 'post'` 有列表页/标签/归档/分类；`type: 'doc'` 有侧边栏
- **`dir` 相对当前 locale 目录**，英文写 `'blog'` 而非 `'en/blog'`
- **`linkPrefix` 不要带 locale 前缀**，主题会自动 `path.join(locale, linkPrefix)`
  （带 `/en/` 会变成 `/en/en/...`）
- `tagsLink` / `archivesLink` / `categoriesLink` **默认基于 `linkPrefix`**，
  不是 `link`。想挂在 `/blog/` 下必须显式指定
- 同一项不要在 `config.ts` 和 `plume.config.ts` 里重复配，后者覆盖前者

## 已知的坑

- 旧 `blog` 配置若不迁移，兼容层会转成 `dir: '/'`，把源目录所有 md 当博客文章
- `docs:build` 的 `--clean-cache` 在 Windows 上报 `ENOTEMPTY`，
  build 前先把 `docs/.vuepress/.cache` 和 `.temp` 移到 `$TEMP`
- build 命令前加 `CODEBUDDY_SAFE_DELETE_ENABLED=0`
- 无头浏览器在
  `C:\Users\HH\AppData\Local\ms-playwright\chromium-1200\chrome-win64\chrome.exe`，
  截图加 `--headless=new --virtual-time-budget=8000` 让动画跑完

## 待办

- ~~Giscus `repoId` / `categoryId` 未填~~ → 已填（2026-10-10），评论配置完成
- `preview/markdown.md` 用了废弃的 `::: demo-wrapper` 容器，应改 `::: window`