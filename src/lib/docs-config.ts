import intro from "@/content/intro.mdx?raw";
import causaEngine from "@/content/causa_engine.md?raw";
import economic from "@/content/economic.md?raw";
import garp from "@/content/garp.md?raw";
import philosophy from "@/content/philosophy.md?raw";
import technology from "@/content/technology.md?raw";

export const docsConfig = [
  {
    title: "Introduction",
    slug: "intro",
    content: intro,
  },
  {
    title: "Philosophy",
    slug: "philosophy",
    content: philosophy,
  },
  {
    title: "Technology",
    slug: "technology",
    content: technology,
  },
  {
    title: "Causa Engine",
    slug: "causa-engine",
    content: causaEngine,
  },
  {
    title: "Economic Model",
    slug: "economic",
    content: economic,
  },
  {
    title: "GARP",
    slug: "garp",
    content: garp,
  },
];
