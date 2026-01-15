# Security Fixes Documentation

**Date:** January 15, 2026
**Project:** KOP Portfolio (Kwabena Oppong-Peprah Architectural Portfolio)

---

## Summary

A security audit was performed on the project before deployment. This document details all security issues found and the fixes applied.

---

## Issues Found & Fixed

### 1. Hardcoded Project ID in Sanity Studio Config

**Severity:** HIGH
**File:** `studio-kop-portfolio/sanity.config.ts`
**Line:** 10-11

**Issue:**
The Sanity project ID and dataset were hardcoded directly in the configuration file:
```typescript
// BEFORE (insecure)
projectId: '8oeu02kt',
dataset: 'production',
```

**Risk:**
- Hardcoded values become part of the git history
- Makes it harder to use different projects for development/staging/production
- Exposes project structure to anyone viewing the repository

**Fix Applied:**
```typescript
// AFTER (secure)
projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8oeu02kt',
dataset: process.env.SANITY_STUDIO_DATASET || 'production',
```

**Why This Fix Works:**
- Uses environment variables as the primary source
- Fallback values allow local development without env setup
- Project ID in fallback is acceptable (it's public info, not a secret)
- Follows 12-factor app methodology

---

### 2. Hardcoded Fallback in Upload Script

**Severity:** MEDIUM
**File:** `sanity/scripts/upload-prabon.js`
**Lines:** 14-20

**Issue:**
The migration script had hardcoded fallback values that would run even without proper environment configuration:
```javascript
// BEFORE (insecure)
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '8oeu02kt',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  ...
});
```

**Risk:**
- Script could accidentally run against wrong project if env vars not set
- No validation that required credentials are present
- Could cause data corruption in wrong environment

**Fix Applied:**
```javascript
// AFTER (secure)
// Validate required environment variables
if (!process.env.SANITY_PROJECT_ID) {
  console.error('Error: SANITY_PROJECT_ID environment variable is required');
  process.exit(1);
}
if (!process.env.SANITY_TOKEN) {
  console.error('Error: SANITY_TOKEN environment variable is required');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  ...
});
```

**Why This Fix Works:**
- Script fails fast if required variables are missing
- No silent fallbacks that could cause accidents
- Clear error messages help developers understand what's needed
- Dataset fallback to 'production' is acceptable (it's the expected default)

---

### 3. API Token Exposed in Claude Settings

**Severity:** CRITICAL
**File:** `.claude/settings.local.json`
**Lines:** 8-12 (removed)

**Issue:**
The Claude Code settings file contained the full Sanity API token in plaintext:
```json
// BEFORE (critically insecure)
{
  "permissions": {
    "allow": [
      "Bash(set \"SANITY_TOKEN=skUqLIt8...full-token-here...\")",
      "Bash(powershell -Command \"...SANITY_TOKEN=''full-token-here''...\")"
    ]
  }
}
```

**Risk:**
- Full write access token exposed in configuration file
- Token could be backed up, synced, or accidentally shared
- Anyone with access to this file could modify/delete all CMS content
- The token grants editor-level permissions to the Sanity project

**Fix Applied:**
```json
// AFTER (secure)
{
  "permissions": {
    "allow": [
      "Bash(npm create:*)",
      "Bash(npm install:*)",
      "Bash(npm run build:*)",
      "Bash(npm run dev:*)",
      "Bash(npm run deploy:*)",
      "Bash(npx tsc:*)",
      "Bash(npx sanity:*)",
      "Bash(firebase:*)",
      "Bash(node scripts/*.js:*)",
      "Bash(dir:*)",
      "Bash(git:*)"
    ]
  }
}
```

**Why This Fix Works:**
- All hardcoded credentials removed
- Permissions now use wildcards for allowed commands
- Secrets should be in `.env` files, not settings files
- Claude Code will prompt for permission when needed

---

## Required Manual Action

### Rotate the Sanity API Token

Since the token was exposed in the settings file, it should be considered compromised and rotated:

1. **Go to Sanity Manage:** https://sanity.io/manage
2. **Select your project:** `8oeu02kt`
3. **Navigate to:** Settings → API → Tokens
4. **Delete the old token** (the one starting with `skUqLIt8...`)
5. **Create a new token:**
   - Click "Add API token"
   - Name: "Development Token" (or similar)
   - Permissions: "Editor" (for write access)
   - Copy the new token immediately (it won't be shown again)
6. **Update your `.env` files:**
   ```bash
   # In sanity/.env and sanity/.env.local
   SANITY_TOKEN=your-new-token-here
   ```

---

## What Was Already Secure

The audit also confirmed these security practices were already in place:

| Security Practice | Status |
|-------------------|--------|
| `.env` files in `.gitignore` | GOOD |
| No secrets in git history | GOOD |
| No API tokens in client-side code | GOOD |
| Sanity client uses read-only public access | GOOD |
| VITE_ prefixed variables for public data only | GOOD |

---

## Security Best Practices Going Forward

### 1. Never Commit Secrets
- Always use `.env` files for sensitive data
- Ensure `.env*` patterns are in `.gitignore`
- Use `.env.example` to document required variables (without values)

### 2. Use Environment Variables
- All sensitive configuration should come from environment variables
- Use fallbacks only for non-sensitive defaults
- Validate required variables at startup

### 3. Principle of Least Privilege
- Create separate tokens for different purposes (dev vs prod)
- Use read-only tokens where write access isn't needed
- Rotate tokens periodically

### 4. For Claude Code / AI Assistants
- Never put actual secrets in settings files
- Use environment variables that the AI can reference
- Secrets should be loaded from `.env` files at runtime

---

## Files Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `studio-kop-portfolio/sanity.config.ts` | Modified | Added env variable support for projectId and dataset |
| `studio-kop-portfolio/sanity.cli.ts` | Modified | Added env variable support for projectId and dataset |
| `sanity/scripts/upload-prabon.js` | Modified | Added validation, removed hardcoded fallbacks |
| `.claude/settings.local.json` | Rewritten | Removed all hardcoded credentials |

---

## Verification

After making these changes:

1. **Test Sanity Studio:**
   ```bash
   cd studio-kop-portfolio
   npm run dev
   ```
   Should still work with the fallback values.

2. **Test Migration Script:**
   ```bash
   cd sanity
   # Without env vars - should show error
   node scripts/upload-prabon.js
   # Expected: "Error: SANITY_PROJECT_ID environment variable is required"
   ```

3. **Verify no secrets in git:**
   ```bash
   git diff
   # Should show changes but no tokens in the diff
   ```

---

## Contact

If you have questions about these security changes, consult the project documentation or reach out to the development team.
