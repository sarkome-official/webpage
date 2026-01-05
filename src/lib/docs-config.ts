import intro from "@/content/intro.mdx?raw";
import economic from "@/content/economic.md?raw";
import garp from "@/content/garp.md?raw";
import philosophy from "@/content/philosophy.md?raw";
import technology from "@/content/technology.md?raw";
import infrastructure from "@/content/infrastructure.md?raw";
import agentReasoning from "@/content/agent_reasoning.md?raw";

export const docsConfig = [
  {
    title: "Introduction",
    slug: "intro",
    content: intro,
  },
  {
    title: "Agent Reasoning",
    slug: "agent",
    content: agentReasoning,
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
    title: "Infrastructure",
    slug: "infrastructure",
    content: infrastructure,
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
