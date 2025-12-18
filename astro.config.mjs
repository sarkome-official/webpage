import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import starlight from '@astrojs/starlight';
import robotsTxt from 'astro-robots-txt';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://sarkome.com',
  trailingSlash: 'never',
  adapter: vercel(),
  integrations: [
    starlight({
      title: 'Sarkome Docs',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/sarkome-official' },
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Introduction', slug: 'docs' },
            { label: 'The Problem', slug: 'docs/problem' },
            { label: 'The Target', slug: 'docs/target' },
            { label: 'The Platform', slug: 'docs/platform' },
            { label: 'Roadmap', slug: 'docs/roadmap' },
            { label: 'Investment Thesis', slug: 'docs/investment' },
          ],
        },
      ],
    }),
    tailwind({
      applyBaseStyles: false,
    }), 
    react(), 
    sitemap(), 
    icon(),
    robotsTxt()
  ],
});