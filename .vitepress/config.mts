import { defineConfig } from "vitepress";
import { getSidebars } from "./configs/sidebars.mts";

const sidebar = getSidebars();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Anton修仙传",
  description: "我的修仙生涯心法",
  head: [["link", { rel: "icon", href: "/Front-End-Immortality/head.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Anton", link: "/" },
      { text: "AntonCook", link: "https://antonhu.github.io/Mr.Faucet" },
    ],

    sidebar,
    aside: true,
    outline: {
      level: "deep",
      label: "本文大纲",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/AntonHu" }],
    logo: "/logo.png",
    search: {
      provider: "local",
    },
    carbonAds: {
      code: "广告在哪里",
      placement: "根本没有广告",
    },
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "版权所有 © 2024-2030 AntonHu",
    },
  },
  cleanUrls: true,
  srcDir: "docs",
  lastUpdated: true,
  base: "/Front-End-Immortality",
});
