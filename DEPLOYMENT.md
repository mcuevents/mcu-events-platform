# MCU Creations — Production Deployment Guide

## 1. Build Settings (Netlify)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: `18.x` or `20.x`

---

## 2. Required Production Environment Variables
Set these under **Netlify Dashboard → Site configuration → Environment variables**:

| Variable | Description | Public / Private |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Production domain (`https://mcucreations.com`) | Public |

---

## 3. Custom Domain & DNS Records
After connecting your custom domain in Netlify:

1. **Root Domain (`mcucreations.com`)**:
   - **Type**: `A`
   - **Name**: `@` (or leave blank)
   - **Value**: `75.2.60.5` (Netlify load balancer IP)
2. **Subdomain (`www.mcucreations.com`)**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `<your-site-name>.netlify.app`
3. **HTTPS / SSL**:
   - Automatically provisioned by Let's Encrypt in Netlify once DNS propagates.
