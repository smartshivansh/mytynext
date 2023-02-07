const routes = {
  index: "/",
  signup: "/signup",

  explore: "/explore",

  feeds: "/admin/dashboard/feeds",
  cards: "/admin/dashboard/blogs",
  drafts: "/admin/dashboard/drafts",
  onboarding: "/admin/settings/onboarding",

  profile: "/admin/settings/profile",
  contact: "/admin/settings/contact",
  qrcode: "/admin/settings/qrcode",
  pages: "/admin/settings/pages",
  navbar: "/admin/settings/navbar",
  appearance: "/admin/settings/appearance",
  seo: "/admin/settings/seo",
  analytics: "/admin/settings/analytics",
  link: "/admin/settings/link",
  security: "/admin/settings/security",
  upgrade: "/admin/settings/upgrade",

  blogPost: `/admin/add/editor`,

  imagePost: `/admin/add/image`,
  editImagePost: (id) => `/admin/add/image/${id}`,

  videoPost: `/admin/add/video`,
  editVideoPost: (id) => `/admin/add/video/${id}`,

  quotePost: `/admin/add/quote`,
  editQuotePost: (id) => `/admin/add/quote/${id}`,

  linkPost: `/admin/add/link`,
  editLinkPost: (id) => `/admin/add/link/${id}`,

  setupLinkOnboarding: `/admin/settings/onboarding`,
};
export default routes;
