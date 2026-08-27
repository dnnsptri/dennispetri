# Dennis Petri Website

Temporary website with animated ShaderGradient background.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build static HTML for FTP:
```bash
npm run build
```

The static files will be exported to the `/out` folder, ready for FTP upload.

## Adding Logo Images

Replace the placeholder divs in `app/page.tsx` (around line 80-90) with your actual logo images:

```tsx
<img src="/logos/logo1.svg" alt="Company 1" />
<img src="/logos/logo2.svg" alt="Company 2" />
// ... etc
```

Place your logo images in the `public/logos/` folder.

## Customization

- Update contact links in `app/page.tsx` (LinkedIn, Email, Phone)
- Update footer name in `app/page.tsx`
- Adjust ShaderGradient settings in `app/components/GradientBackground.tsx`