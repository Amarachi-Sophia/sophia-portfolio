# Sophia Olise — Portfolio

A responsive portfolio built with plain HTML, CSS and JavaScript. No build step, paid CMS or database is required. The original black-and-green style is retained.

## Preview on Windows, macOS or Linux

1. Extract the ZIP into a new folder.
2. Double-click **index.html** to view the portfolio. Open Financial Analysis and scroll below its screenshot to see Major KPIs and Key findings.
3. To test editing, open the **editor** folder and double-click its **index.html**.

No Python, Node.js or local server is required. Keep the extracted folder structure intact. Public content is loaded from **content.js** as a normal script, so projects, metrics and editor forms work both when opened directly and on GitHub Pages.

## Publish to GitHub Pages

1. Create or open the portfolio’s GitHub repository.
2. Upload everything in this folder to its root: index.html, CSS/JS files, content.js, assets/, editor/ and .nojekyll. Do not upload the enclosing folder itself.
3. In **Settings → Pages**, select **Deploy from a branch**, **main**, **/ (root)**.
4. Wait for the deployment to finish. Relative file paths work for both username.github.io and username.github.io/repository-name/.

The site is not connected to a repository or published by this ZIP. GitHub account/repository setup happens separately.

## Edit without changing layout code

Open **editor/index.html** locally, or visit **your-site-address/editor/** once deployed. The editor has forms for:

- Profile, email/social links, intro/about text and experience years.
- Education and work experience.
- Projects, multiple screenshots, KPIs, key findings, explanations/methodology and tests/validation.
- Certificates and their images.

Edit the fields and click **Download content.js**. For a local preview, replace **content.js** beside the main index.html and reload the page. To publish, replace **content.js** in the GitHub repository and commit. GitHub Pages publishes the change when deployment finishes. Download before leaving the editor: edits live only in the current tab. Import a downloaded content.js to continue editing. Older content.json exports can also be imported; new exports use content.js.

For a new image, upload it into **assets/** in the repository and enter **assets/your-image.webp** in the form. Use simple filenames without spaces. PNG/JPG also work. Image descriptions help visitors using assistive technology. A project must have at least one screenshot and a unique lowercase ID such as **customer-retention**. Multiple screenshots automatically create carousel controls. Empty optional lists are hidden in the project view. The featured count updates automatically.

**This is a free export-and-upload editor, not a login-backed publishing dashboard.** Anyone can open it, but it has no write access to the repository or live website. It contains no GitHub tokens, passwords or API keys. There is no Decap CMS integration or subscription dependency.

## Interaction

- Project images, titles and “Explore project” open a case study inside the website.
- Click a screenshot to enlarge it; “Back to project” returns to its details.
- Arrow buttons, dots and left/right keys browse multiple screenshots. Mobile users can also swipe horizontally.
- Close exits the viewer; Escape returns from an enlarged screenshot, then closes the case study. Browser Back exits a project opened from the page. Focus returns to the opener.
- Certificates use the same in-page viewer.
- The timeline fills to the reading position and reverses when scrolling back. With reduced motion enabled it remains filled; reveals and spinning text stop.

## Content to confirm before publishing

- **5+ years** is the placeholder requested for this draft. Replace it with Sophia’s verified experience.
- Paseo sales are **$33.01M**, based on the dashboard label **$33,011K**. The supplied note said $33.01K; this has been corrected. Repeated findings were removed.
- Existing project metrics are retained. No unprovided test results or business outcomes were invented; add those using the optional fields when available.
- LinkedIn and GitHub remain placeholders until real profile URLs are entered.

## Files

- **content.js**: the single editable public content file; works without a server.
- **content-loader.js**: renders the public content, escaping user-entered text.
- **script.js**: menu, reveals, timeline fill and section navigation.
- **project-viewer.js**: case studies and image galleries.
- **styles.css**: page and viewer styles, including mobile layouts.
- **editor/**: form-based content editor.
- **assets/**: original portrait, dashboard and certificate images.

## Icons

Navigation and interface SVGs use Lucide Static 1.50.0. Tool/brand SVGs use Simple Icons 11.15.0 (Power BI, Excel, LinkedIn and GitHub). SQL uses a database icon because SQL is a language rather than a single product. All icon paths are bundled locally, so the page does not depend on an icon CDN. See **THIRD-PARTY-NOTICES.txt** for source and license notices. The Google Fonts request is optional; Arial is the fallback.

Official references: https://lucide.dev, https://github.com/simple-icons/simple-icons/tree/11.15.0, https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages.

## Migrating from the previous ZIP

The earlier version read content.json with a browser request. Opening the HTML directly blocked that request and used a basic fallback that omitted KPIs and findings. This version loads all public content from content.js instead. Use the new ZIP in a fresh folder. If you already edited an older content.json, import it in the new editor, download content.js, and replace content.js in the site folder. The old content.json is no longer used.
