## Plan: Implement Mintlify-style Documentation

We will create a dedicated documentation section with a 3-column layout (Sidebar, Content, Table of Contents) using your existing markdown content and `react-markdown`.

### Steps
1. Create [src/lib/docs-config.ts](src/lib/docs-config.ts) to map slugs to your raw MDX files (using `?raw` imports).
2. Create [src/pages/docs/DocsLayout.tsx](src/pages/docs/DocsLayout.tsx) to implement the main layout with a sidebar navigation.
3. Create [src/pages/docs/DocPage.tsx](src/pages/docs/DocPage.tsx) to render the markdown content and a dynamic "On this page" Table of Contents.
4. Update [src/App.tsx](src/App.tsx) to include the new `/docs` routes within the public routing section.

### Further Considerations
1. `react-markdown` is already installed, so no new dependencies are needed.
2. We will use `shadcn/ui` components (`ScrollArea`, `Sheet` for mobile) to maintain design consistency.
