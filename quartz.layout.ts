import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.PageNavigation(),
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'zmqqqq/zmqqqq.github.io',
        // from data-repo-id
        repoId: 'R_kgDORC-IQg',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'DIC_kwDORC-IQs4C1h0C',
        // from data-lang
	      inputPosition: "top",
        lang: 'zh-CN'
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/zmqqqq",
      // "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    // Component.DesktopOnly(Component.RecentNotes({
    //   limit: 3,
    //   showTags: false,
    //   filter: (f) => f.frontmatter?.tags?.includes('intro') ? false : true,
    //   sort: (f1: QuartzPluginData, f2: QuartzPluginData) => {
    //     if (f1.frontmatter?.date && f2.frontmatter?.date) {
    //       // Sort by date
    //       if (f1.frontmatter?.date && f2.frontmatter?.date) {
    //         return f1.frontmatter.date < f2.frontmatter.date ? 1 : -1
    //       } else if (f1.frontmatter?.date && !f2.frontmatter?.date) {
    //         return -1
    //       } else if (!f1.frontmatter?.date && f2.frontmatter?.date) {
    //         return 1
    //       }

    //       const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    //       const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    //       return f1Title.localeCompare(f2Title)
    //     }
    //     return 0
    //   }
    // })),
    Component.DesktopOnly(
    Component.RecentNotes({
      limit: 3,
      showTags: false,
      filter: (f) => !f.frontmatter?.tags?.includes("intro"),
      sort: (f1, f2) => {
        const m1 = f1.dates?.modified?.getTime()
        const m2 = f2.dates?.modified?.getTime()

        // 两篇都有 modified：新→旧
        if (m1 != null && m2 != null) return m2 - m1

        // 只有一篇有 modified：有的排前
        if (m1 != null && m2 == null) return -1
        if (m1 == null && m2 != null) return 1

        // 兜底：按标题
        const t1 = (f1.frontmatter?.title ?? "").toLowerCase()
        const t2 = (f2.frontmatter?.title ?? "").toLowerCase()
        return t1.localeCompare(t2)
      },
    }) ) ,
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        if (a.isFolder && b.isFolder)
          return (a.slug > b.slug) ? 1 : -1
        if (a.isFolder && !b.isFolder)
          return -1
        if (!a.isFolder && b.isFolder)
          return 1
        if (a.data?.date && b.data?.date)
          return a.data.date < b.data.date ? 1 : -1
        return a.displayName.localeCompare(b.displayName)
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
