module.exports = {
  layout: "layouts/blog-post.njk",
  tags: ["blog"],
  activeNav: "blog",
  author: "Equipa Hígidus",
  draft: false,
  permalink: (data) => `/blog/${data.page.fileSlug}/`,
  eleventyComputed: {
    seoTitle: (data) => `${data.title || "Artigo"} | Blog Hígidus`,
    description: (data) => data.description || "Insights técnicos sobre solos contaminados, remediação e conformidade ambiental.",
    coverImage: (data) => data.coverImage || "/assets/img/hero-about.jpg",
    dateModified: (data) => data.updated || data.date,
  },
};
