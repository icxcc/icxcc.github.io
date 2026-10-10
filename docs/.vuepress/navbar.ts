/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 这里用工厂函数按 locale 生成导航项：locale 前缀由参数传入，
 * 避免在静态数组里写死 `/en/`，导致两语言配置互相串味。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

/**
 * @param prefix locale 路径前缀，中文为 `/`，英文为 `/en/`
 */
function createNavbar(prefix: '/en/' | '/') {
  const isEn = prefix === '/en/'
  return defineNavbarConfig([
    // 首页指向 locale 根路径。README 的 permalink 由 autoFrontmatter 自动生成，
    // 不可用作首页链接，否则中英文会同时指向同一篇文章。
    { text: isEn ? 'Home' : '首页', link: prefix },
    { text: isEn ? 'Blog' : '博客', link: `${prefix}blog/` },
    { text: isEn ? 'Tags' : '标签', link: `${prefix}blog/tags/` },
    { text: isEn ? 'Archives' : '归档', link: `${prefix}blog/archives/` },
    {
      text: isEn ? 'Notes' : '笔记',
      // 指向 doc 集合的 linkPrefix，而非源文件路径
      items: [{ text: isEn ? 'Demo' : '示例', link: `${prefix}demo/` }],
    },
    { text: isEn ? 'Web3 Demo' : 'Web3', link: `${prefix}web3/` },
    { text: isEn ? 'About' : '关于', link: `${prefix}about/` },
  ])
}

export const zhNavbar = createNavbar('/')

export const enNavbar = createNavbar('/en/')