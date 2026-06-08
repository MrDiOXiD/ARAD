# الکتریکی آنلاین — Header (Next.js)

## One-time setup

Run this inside your Next.js project root:

```bash
npm install bootstrap-icons
```

That's the only extra dependency needed.

## Drop these files into your project

| File | Destination |
|------|-------------|
| `components/Header.tsx` | `components/Header.tsx` |
| `styles/globals.css` | `styles/globals.css` (or your existing globals) |
| `tailwind.config.js` | merge `theme.extend` into yours |
| `app/layout.tsx` | `app/layout.tsx` |
| `app/page.tsx` | `app/page.tsx` |
| `postcss.config.js` | only if you don't have one |

## If you already have a globals.css

Just add this one line after your `@tailwind` directives:

```css
@import 'bootstrap-icons/font/bootstrap-icons.css';
```

## Adding your logo

In `Header.tsx`, find `.elec-logo` div and replace it:

```tsx
import Image from 'next/image';
// ...
<div className="elec-logo">
  <Image src="/logo.png" alt="لوگو" width={110} height={44} />
</div>
```

## Why this works

All header styles are embedded in a `<style>` tag inside the component itself.
This means zero dependency on Tailwind custom config, zero CDN calls, and
zero purging issues. Bootstrap Icons are loaded from `node_modules` via
`@import 'bootstrap-icons/font/bootstrap-icons.css'` in globals.css —
which Next.js handles perfectly after `npm install bootstrap-icons`.
