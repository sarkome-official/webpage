import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Configuration ---
const DOMAIN = 'https://sarkome.com';
const DIST_DIR = 'dist';

// --- Static Routes ---
const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/platform', priority: '0.9', changefreq: 'weekly' },
    { path: '/knowledge-graph', priority: '0.8', changefreq: 'monthly' },
    { path: '/knowledge-graph-nodes', priority: '0.7', changefreq: 'monthly' },
    { path: '/alphafold', priority: '0.8', changefreq: 'monthly' },
    { path: '/api', priority: '0.7', changefreq: 'monthly' },
    { path: '/sim', priority: '0.6', changefreq: 'monthly' },
    { path: '/threads', priority: '0.5', changefreq: 'daily' },
    { path: '/docs', priority: '0.8', changefreq: 'weekly' },
];

// --- Dynamic Routes Logic ---
// Note: We avoid direct imports from src to prevent TS execution issues with browser-only code
// We'll read the files as strings or use simplified parsing if needed, 
// but since we are running with tsx, we can try to import them if they are clean of browser globals.

async function generateSitemap() {
    console.log('Generating sitemap...');

    const urls: string[] = [];
    const now = new Date().toISOString().split('T')[0];

    // Helper to add URL to sitemap
    const addUrl = (path: string, priority = '0.5', changefreq = 'monthly') => {
        urls.push(`
  <url>
    <loc>${DOMAIN}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    };

    // 1. Add Static Routes
    STATIC_ROUTES.forEach(route => addUrl(route.path, route.priority, route.changefreq));

    // 2. Add Dynamic Routes: Programs
    try {
        // We import directly using tsx's ability to resolve TS
        // We adjust paths since this script runs from the root
        const { diseases } = await import('../src/data/diseases');
        if (Array.isArray(diseases)) {
            diseases.forEach((d: any) => {
                addUrl(`/programs/${d.id}`, '0.8', 'monthly');
            });
            console.log(`Added ${diseases.length} program routes.`);
        }
    } catch (e) {
        console.warn('Could not load diseases for sitemap:', e);
    }

    // 3. Add Dynamic Routes: Docs
    try {
        const docsConfigPath = path.resolve(process.cwd(), 'src/lib/docs-config.ts');
        const content = fs.readFileSync(docsConfigPath, 'utf-8');
        const slugRegex = /slug:\s*["']([^"']+)["']/g;
        let match;
        let count = 0;
        while ((match = slugRegex.exec(content)) !== null) {
            addUrl(`/docs/${match[1]}`, '0.7', 'monthly');
            count++;
        }
        console.log(`✅ Added ${count} documentation routes.`);
    } catch (e) {
        console.warn('⚠️ Could not parse docs-config:', e);
    }

    // Create Sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    // Ensure dist directory exists (it should if running postbuild, but let's be safe)
    const outputPath = path.resolve(process.cwd(), DIST_DIR, 'sitemap.xml');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, sitemap.trim());
    console.log(`Sitemap generated successfully at ${outputPath}`);
}

generateSitemap().catch(console.error);
