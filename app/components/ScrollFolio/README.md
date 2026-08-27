# ScrollFolio Component

A premium editorial scroll portfolio component for Next.js/React. Inspired by [1042 Studio's CMS Scroll Folio](https://www.1042.studio/store/cms-scroll-folio).

**Perfect for**: Portfolios, case studies, photography showcases, editorial features, and visual archives.

---

## Features

- ✨ **Sticky scroll layout** - Image stays anchored while content cycles
- 🎬 **Editorial transitions** - Smooth, controlled pacing between projects
- 🗂️ **Overlay navigator** - Thumbnail sidebar for quick project navigation
- 📋 **List view toggle** - Alternative grid overview mode
- 📱 **Fully responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **CMS-ready** - Typed TypeScript interface for any headless CMS
- ⚡ **Performance optimized** - Image preloading, lazy loading, will-change hints

---

## Quick Start

### 1. Copy the files

Copy these files to your project:

```
components/
  ScrollFolio.tsx      # Main component
  
styles/
  scroll-folio.css     # Or add to your globals.css
```

### 2. Import and use

```tsx
import ScrollFolio, { Project } from '@/components/ScrollFolio'

const projects: Project[] = [
  {
    id: '1',
    title: 'Project Name',
    category: 'Category',
    description: 'Brief description...',
    image: '/images/project-1.jpg',
    link: 'https://example.com',
    year: '2024',
    client: 'Client Name',
    tags: ['Tag1', 'Tag2']
  },
  // ... more projects
]

export default function PortfolioPage() {
  return (
    <ScrollFolio 
      projects={projects}
      title="Selected Work"
      showNavigator={true}
      allowListView={true}
    />
  )
}
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `projects` | `Project[]` | required | Array of project data |
| `title` | `string` | `undefined` | Header title text |
| `showNavigator` | `boolean` | `true` | Show/hide overlay navigator |
| `allowListView` | `boolean` | `true` | Allow toggling to list view |
| `onProjectChange` | `function` | `undefined` | Callback when active project changes |

---

## Project Interface

```typescript
interface Project {
  id: string           // Unique identifier
  title: string        // Project title
  category: string     // Category/type label
  description: string  // Brief description
  image: string        // Image URL or path
  link?: string        // Optional project URL
  year?: string        // Optional year
  client?: string      // Optional client name
  tags?: string[]      // Optional tag array
}
```

---

## CMS Integration

### Contentful

```typescript
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

async function getProjects(): Promise<Project[]> {
  const entries = await client.getEntries({
    content_type: 'project',
    order: '-fields.year',
  })

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    title: item.fields.title,
    category: item.fields.category,
    description: item.fields.description,
    image: `https:${item.fields.image.fields.file.url}`,
    link: item.fields.link,
    year: item.fields.year,
    client: item.fields.client,
    tags: item.fields.tags,
  }))
}
```

### Sanity

```typescript
import { client } from '@/sanity/lib/client'

async function getProjects(): Promise<Project[]> {
  return client.fetch(`
    *[_type == "project"] | order(year desc) {
      "id": _id,
      title,
      category,
      description,
      "image": image.asset->url,
      link,
      year,
      client,
      tags
    }
  `)
}
```

### Payload CMS

```typescript
import { getPayloadClient } from '@/payload/client'

async function getProjects(): Promise<Project[]> {
  const payload = await getPayloadClient()
  
  const { docs } = await payload.find({
    collection: 'projects',
    sort: '-year',
  })

  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    description: doc.description,
    image: doc.image.url,
    link: doc.link,
    year: doc.year,
    client: doc.client,
    tags: doc.tags,
  }))
}
```

---

## Customization

### Colors

Update the CSS variables or find/replace these values:

| Color | Default | Usage |
|-------|---------|-------|
| `#FAFAFA` | Light text | Headings, body text |
| `#FFFF33` | Accent yellow | Categories, active states, buttons |
| `#2A2C2B` | Dark | Button hover text |

### Typography

The component uses your existing font stack. Ensure your CSS includes:

```css
* {
  font-family: 'Your Font', sans-serif;
}
```

### Animations

Adjust transition timing in CSS:

```css
.sf-image-wrapper {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Static Data Usage

For static sites or when not using a CMS:

```typescript
// data/projects.ts
import { Project } from '@/components/ScrollFolio'

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    category: 'Product Design',
    description: 'Complete overhaul of the shopping experience...',
    image: '/images/projects/ecommerce.jpg',
    link: 'https://example.com/case-study',
    year: '2024',
    client: 'RetailCo',
    tags: ['UX', 'E-commerce', 'Mobile']
  },
  // Add more projects...
]
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses modern CSS features:
- `position: sticky`
- `backdrop-filter`
- CSS custom properties
- `dvh` viewport units (with fallback)

---

## Performance Tips

1. **Optimize images** - Use WebP/AVIF, proper sizing
2. **Lazy load** - Images below the fold load on demand
3. **Limit projects** - 10-15 projects max for best performance
4. **Preload hero** - First 2 images are eagerly loaded

---

## License

Standard License: Use in personal and client projects.
Extended License: Use in templates and products for resale.

---

## Support

Questions? Issues? 
- Open an issue on GitHub
- Email: support@example.com

---

Made with ❤️ for creative developers
