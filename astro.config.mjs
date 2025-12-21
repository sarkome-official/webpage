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
      title: 'Sarkome Institute',
      social: [
        { icon: 'github', label: 'GitHub', href: 'un' },
      ],
      sidebar: [
        {
          label: 'The Institute',
          link: '/docs',
        },
        {
          label: 'Causal Engine',
          link: '/docs/causa_engine',
        },
        {
          label: 'GARP',
          link: '/docs/garp',
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