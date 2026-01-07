# Deployment Guide - Vercel

This guide explains how to deploy the Fenix Trading Academy application to Vercel with proper environment variable configuration.

## Prerequisites

- Vercel account
- GitHub repository connected to Vercel (or use Vercel CLI)
- Environment variable values ready

## Environment Variables Setup

The application requires the following environment variables to be configured in Vercel:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GOOGLE_SHEETS_URL` | Google Apps Script deployment URL for lead storage | `https://script.google.com/macros/s/YOUR_ID/exec` |
| `VITE_META_PIXEL_ID` | Facebook/Meta Pixel ID from Business Manager | `123456789012345` |
| `VITE_CRM_PASSWORD` | Password for CRM access at `/crm` route | `fenix@2026` |

### Setting Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Enter the variable name (e.g., `VITE_GOOGLE_SHEETS_URL`)
   - **Value**: Enter the actual value
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

## Google Sheets Setup

The application uses Google Apps Script to store leads. You'll need to:

1. Create a Google Sheet for lead storage
2. Set up an Apps Script with `doGet` and `doPost` methods
3. Deploy as a web app
4. Copy the deployment URL to `VITE_GOOGLE_SHEETS_URL`

## Meta Pixel Configuration

### Important: VSL Route Only

The Meta Pixel is configured to initialize **only on the VSL route** (`/vsl`). This means:

- ✅ Pixel loads on `/vsl` (Academy/VSL page)
- ❌ Pixel does NOT load on `/` (Gateway/Linktree)
- ❌ Pixel does NOT load on `/ai` (Trading Bot)
- ❌ Pixel does NOT load on `/crm` (Admin Dashboard)

This scoped approach ensures pixel events are only tracked for the VSL funnel, avoiding unnecessary tracking on other pages.

### Setup Steps

1. Get your Pixel ID from Facebook Business Manager  (Meta Events Manager)
2. Set `VITE_META_PIXEL_ID` in Vercel environment variables
3. Verify pixel fires only on VSL using Facebook Pixel Helper extension

## Deployment

### Via Git Integration (Recommended)

1. Push code to your GitHub repository
2. Vercel will auto-deploy on push
3. Verify deployment in Vercel dashboard

### Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

## Local Development

For local development, create a `.env.local` file (already gitignored):

```bash
# Copy template
cp .env.example .env.local

# Edit with your actual values
# Then run dev server
npm run dev
```

## Verification Checklist

After deployment, verify:

- [ ] Navigate to `/crm` - password prompt appears
- [ ] Enter configured password - access granted
- [ ] Submit a test lead from `/vsl` - appears in Google Sheet
- [ ] Check Meta Pixel with Facebook Pixel Helper on `/vsl`
- [ ] Verify Meta Pixel does NOT load on `/ai` or `/`
- [ ] Check browser console for any env var errors

## Troubleshooting

### "Property 'env' does not exist on type 'ImportMeta'"

Make sure `vite-env.d.ts` is included in your project with proper type declarations.

### Pixel not firing

- Check that `VITE_META_PIXEL_ID` is set in Vercel
- Verify you're on the `/vsl` route (pixel only loads there)
- Open browser console to see pixel initialization logs

### Google Sheets not receiving leads

- Verify `VITE_GOOGLE_SHEETS_URL` is correct
- Check Apps Script deployment is set to "Anyone" access
- Review browser network tab for failed POST requests

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Rotate CRM password if accidentally exposed
- Google Sheets URL is semi-public but protected by Apps Script logic
- Meta Pixel ID is public by nature (visible in page source)
