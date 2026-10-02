# Verification

Tested in headless Chromium under a repository-style HTTP subdirectory and by opening the HTML files directly.

## Responsive checks

320×568, 360×800, 390×844, 430×932, 768×1024, 920×800, 1024×768, 1280×720, 1440×900, 1920×1080 and 844×390.

At each size: no horizontal overflow in the page or case-study dialog; timeline fills progressively, reaches the last dot, and resets when scrolling to the top; the project viewer displays five financial KPIs and six distinct findings; image enlargement, Escape and Close work; certificates stay within the website; the menu opens, closes and contains keyboard focus.

## Functional checks

- Carousel buttons, dots, keyboard arrows, wrap-around and simulated touch swipe events.
- Browser Back and directly opening a project hash.
- Adding a fourth project updates cards and featured count automatically.
- Optional explanation and validation sections render from supplied content.
- Reduced-motion preferences stop animation and keep the timeline filled.
- Follow-up regression: opening the old ZIP directly reproduced missing metrics. The corrected content.js loads all five financial KPIs and six findings on direct-file and HTTP previews at 390px and 1440px.
- The mobile content editor opens directly without a server. Content.js export/reimport and import of legacy content.json files were checked. Exported content preserves metrics and updates the rendered profile.
- JavaScript syntax, SVG references, unique project IDs and local image paths checked.

Desktop, mobile, tool icons, project details and timeline screenshots were inspected for layout. These are browser-based checks, not testing on physical phones or in every browser. The GitHub Pages publishing instructions are provided; no repository was connected or live deployment performed.
