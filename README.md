# HIGIDUS Website (11ty + HTML + Tailwind)

Multi-page website with shared design system, strong SEO foundations, and GEO-oriented positioning.

## Stack
- Eleventy (11ty) for static generation
- HTML + Tailwind utility classes
- Shared JS/CSS in `/assets`

## Reusable Global Blocks
- Header: `/_includes/partials/header.njk`
- Footer: `/_includes/partials/footer.njk`

All pages include these partials, so navigation and footer stay consistent site-wide.
Per-page active state is controlled via front matter:
- `activeNav` (`home`, `company`, `services`, `sectors`, `projects`, `certifications`, `contact`)
- `activeSector` (`construcao`, `industria`, `postos`, `municipal`)
- `headerVariant` (`home` on homepage only)

## Local Development
1. Install dependencies:
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Build static output:
   - `npm run build`

Generated output is written to `/_site`.

## Implemented Pages
- `/` homepage
- `/sobre-nos/`
- `/servicos/avaliacao-diagnostico/`
- `/servicos/remediacao-tratamento/`
- `/servicos/conformidade-regulacao/`
- `/setores/construcao/`
- `/setores/industria/`
- `/setores/postos-de-combustivel/`
- `/setores/municipal/`
- `/projetos/`
- `/certificacoes/`
- `/contacto/`
- `/politica-de-privacidade/`
- `/404.html`

## Shared Assets
- `/assets/styles.css`: global design system styles, layout guides, interactions styling.
- `/assets/site.js`: shared interactions (mobile menu, counters, service modal, case modal, filters, floating emergency CTA, cookie banner, form prefill from query params).
- `/assets/img/*.svg`: self-hosted placeholder visuals for all sections.

## SEO/GEO Files
- `/robots.txt`
- `/sitemap.xml`
- `/site.webmanifest`
- `JSON-LD` included on core pages (home, about, service, contact)
- per-page `title`, `description`, `canonical`, Open Graph/Twitter meta

## Replace Before Launch
1. Replace `https://example.com` with your real domain on all pages.
2. Replace placeholder contact values (`+351 XXX XXX XXX`, emails, `[Morada]`).
3. Replace placeholder team names and all placeholder SVG images with real photography.
4. Replace indicative metrics (`+120`, `+60`, etc.) with audited real numbers.
5. Review legal pages and cookie handling for final GDPR compliance.

## Performance Note
- Tailwind is loaded via CDN for speed of iteration.
- For production performance, compile Tailwind and serve optimized static CSS/JS bundles.
