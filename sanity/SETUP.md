# Sanity CMS Setup Guide

Follow these steps to set up your Sanity CMS and import your portfolio data.

## Step 1: Create a Sanity Account

1. Go to [sanity.io](https://sanity.io)
2. Click "Get Started" and sign up (free tier is sufficient)
3. Verify your email

## Step 2: Create a New Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click "Create new project"
3. Name it: `kop-portfolio`
4. Select "Create empty project with CLI"
5. Note your **Project ID** (looks like: `abc123xy`)

## Step 3: Create an API Token

1. In your project dashboard, go to **Settings** > **API**
2. Under "Tokens", click **Add API Token**
3. Name it: `Migration Token`
4. Select **Editor** permissions (needed for uploads)
5. Click **Save**
6. **Copy the token immediately** (you won't see it again!)

## Step 4: Configure Environment Variables

Create a `.env` file in the `sanity` folder:

```bash
# In D:\Projects\KOP\sanity\.env

SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

# For migration
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_TOKEN=your-token-here
```

## Step 5: Run the Migration

Open a terminal in the `sanity` folder and run:

```bash
cd D:\Projects\KOP\sanity
npm run migrate
```

This will:
- Upload all 48 images from the assets folder
- Create 9 project documents from the CSV data
- Create site settings

The migration takes about 2-3 minutes.

## Step 6: Verify in Sanity Studio

Start the Studio to see your content:

```bash
npm run dev
```

Open http://localhost:3333 to access Sanity Studio.

## Step 7: Update the Main App

Update the main app's environment file:

```bash
# In D:\Projects\KOP\.env.local

VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
```

## Step 8: Test the App

```bash
cd D:\Projects\KOP
npm run dev
```

Your portfolio should now display data from Sanity!

---

## Troubleshooting

### "SANITY_TOKEN is required"
Make sure you created the `.env` file with your token.

### "Project not found"
Double-check your project ID in the Sanity dashboard.

### Images not uploading
Make sure your token has **Editor** permissions, not just **Viewer**.

### "Access denied"
The token might have expired. Create a new one in the dashboard.
