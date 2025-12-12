# Component conventions

- Folders: `atoms`, `molecules`, `organisms`, `decorations`, `ui`.
- Use PascalCase for component files and folders.
- `.astro` for Astro components, `.tsx` for React/TSX components.
- Each folder exposes an `index.ts` barrel for centralized imports.
- Import components from `src/components` where convenient: `import { Header } from '../components'`.

Examples:

```ts
import { Header, Footer } from '../components';
```
