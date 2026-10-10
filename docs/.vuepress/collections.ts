/**
 * @see https://theme-plume.vuejs.press/config/collections/ 查看文档了解配置详情。
 *
 * Collections 配置文件，在 `.vuepress/config.ts` 中被导入。
 *
 * 请注意，你应该先在这里配置好 Collections，然后再启动 vuepress。
 * 主题会在启动时读取这里配置的 Collections，据此：
 * - 决定哪些 Markdown 归属文章列表 / 文档集合
 * - 为这些文件自动生成 permalink
 * - 判断页面链接前缀以决定是否渲染侧边栏
 *
 * collections 属于需要重启服务才能生效的配置，因此放在 `config.ts` 中引用，
 * 而不是热更新的 `plume.config.ts`。
 *
 * 字段说明：
 * - `defineCollection` 用于定义单个 collection
 * - `defineCollections` 用于定义 collection 数组
 */

import { defineCollection, defineCollections } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

/**
 * 博客文章集合（post 类型）
 * 对应 `docs/blog/` 目录，提供文章列表页、标签页、归档页、分类页
 */
export const zhBlog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: '博客',
  // 文章列表页链接
  link: '/blog/',
  // 文章链接前缀，保留原有的 /article/ 前缀，避免历史 permalink 失效
  linkPrefix: '/article/',
  // 标签/归档/分类页链接，默认基于 linkPrefix，此处显式指定挂在列表页下
  tagsLink: '/blog/tags/',
  archivesLink: '/blog/archives/',
  categoriesLink: '/blog/categories/',
  // 文章封面位置
  postCover: 'right',
  // 每页显示文章数量
  pagination: 15,
})

/**
 * 笔记文档集合（doc 类型）
 * 对应 `docs/notes/demo/` 目录，提供侧边栏导航
 */
export const zhDemoNote = defineCollection({
  type: 'doc',
  dir: 'notes/demo',
  // 页面链接前缀，同时作为侧边栏的匹配依据
  linkPrefix: '/demo/',
  title: '笔记示例',
  // 手动配置侧边栏结构：空字符串代表目录下的 README.md
  sidebar: ['', 'foo', 'bar'],
  // 根据文件结构自动生成侧边栏
  // sidebar: 'auto',
})

export const zhCollections = defineCollections([zhBlog, zhDemoNote])

/* =================== locale: en-US ======================= */

/**
 * 博客文章集合（post 类型）
 * 对应 `docs/en/blog/` 目录
 *
 * 注意：`dir` 相对于当前 locale 目录，无需带 `/en` 前缀。
 */
export const enBlog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: 'Blog',
  link: '/blog/',
  linkPrefix: '/article/',
  tagsLink: '/blog/tags/',
  archivesLink: '/blog/archives/',
  categoriesLink: '/blog/categories/',
  postCover: 'right',
  pagination: 15,
})

/**
 * 笔记文档集合（doc 类型）
 * 对应 `docs/en/notes/demo/` 目录
 *
 * 注意：`linkPrefix` 不要带 `/en` 前缀，主题会自动与 locale 拼接。
 */
export const enDemoNote = defineCollection({
  type: 'doc',
  dir: 'notes/demo',
  linkPrefix: '/demo/',
  title: 'Demo',
  sidebar: ['', 'foo', 'bar'],
})

export const enCollections = defineCollections([enBlog, enDemoNote])