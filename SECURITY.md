# Security Policy

## Overview

This project implements a static comic reader with security best practices built in. No sensitive data is ever transmitted or stored server-side.

---

## Security Controls

### 1. **Content Security Policy (CSP)**
- Enforced via `<meta http-equiv>` tag in `index.html`
- Restricts inline scripts (`script-src 'self'`)
- Allows fonts from Google Fonts only
- Blocks object embedding (`object-src 'none'`)
- Prevents clickjacking (`X-Frame-Options: SAMEORIGIN`)

### 2. **Input Validation**
- **Slug Validation**: All comic slugs validated with regex `/^[a-z0-9\-_]+$/`
  - Max length: 100 characters
  - Only alphanumerics, hyphens, underscores allowed
  - Prevents path traversal attacks
- **Filename Validation**: Panel filenames must match `/^[\w\-\.]+\.jpg$/i`
  - Ensures only `.jpg` files are loaded
  - Prevents arbitrary file access

### 3. **XSS Prevention**
- ✅ No `innerHTML` used for user-controlled data
- ✅ `textContent` used for all text content (safe from HTML injection)
- ✅ DOM elements created programmatically
- ✅ No inline `onclick` handlers
- ✅ Event listeners used instead

### 4. **HTTP Security Headers**
- `X-Content-Type-Options: nosniff` — prevents MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` — clickjacking protection
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer info

---

## Adding Comics Safely

When adding new comics to `js/comics.js`:

```js
{
  slug: 'safe-slug-name',  // ✓ lowercase, hyphens/underscores only
  status: 'available',      // ✓ 'available' or 'coming-soon'
  title: 'Safe Title',      // ✓ text only, no HTML
  tag: 'Category · Tag',    // ✓ text only
  author: 'Name',           // ✓ text only
  desc: 'Description',      // ✓ text only, will be rendered as textContent
  panels: 15,               // ✓ number only
  captions: [
    { title: "Text", caption: "Text" },
    // ✓ Both title and caption are text-only, rendered safely
  ]
}
```

**Do NOT:**
- Use `<div>`, `<script>`, or HTML in any string field
- Include special characters in slug (`.`, `..`, `/`, `\`)
- Use arbitrary filenames (stick to `panel-##.jpg` format)

---

## Deployment Security

### Netlify
- ✓ Automatic HTTPS
- ✓ No server-side processing = no code injection vectors
- Recommended: Enable auto-deploy from GitHub with branch protection

### Self-Hosted
- ✓ Serve over HTTPS only
- ✓ Set security headers at web server level:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  ```
- ✓ Ensure proper file permissions (644 for files, 755 for dirs)

---

## Known Limitations / Design

1. **Static Content Only** — All comic data is baked into `js/comics.js`. There's no dynamic backend, which is intentional for simplicity and security.
2. **Client-Side Validation** — Slug validation happens in JavaScript. This is sufficient for this use case because slugs are defined by the author (not user input from a form).
3. **No User Accounts** — This is a read-only, public website. No authentication model.
4. **Image Format Enforcement** — Only `.jpg` images are loaded. PNG/other formats rejected by filename validation.

---

## Incident Reporting

If you discover a security vulnerability, please report it privately to the maintainer. Do not open a public issue or PR disclosing the vulnerability.

---

## Updates & Patches

- This project is a static site generator. Security patches will be released when:
  - New OWASP guidelines emerge
  - Browser security features change
  - Validation logic is enhanced
- Updates will be tagged as releases on GitHub.

---

**Last Updated:** April 2026  
**Security Review:** Complete — XSS, CSRF, path traversal, and CSP vulnerabilities addressed.
