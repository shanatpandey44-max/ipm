# Deployment Notes

This repository contains a combined backend and frontend app.

## Why deployment failed
The frontend build requires Node 20.19+ while the build environment was using Node 18.20.8.

## What changed
- Root `package.json` now declares `engines.node: ">=20.19.0"`
- Added root `.nvmrc` with Node 20.19.0
- Added root `start.sh` to provide an explicit startup script
- Added `engines.node` to both `backend/package.json` and `frontend/package.json`

## Deploy commands
```bash
npm install
npm start
```

## Railpack/Node deployment notes
- The app starts from `backend/index.js`
- Root `Procfile` uses `web: cd backend && npm start`
- Root `start.sh` uses the same command for platforms that require a shell entrypoint

## If deployment still fails
1. Ensure the service uses Node 20+.
2. If it ignores `package.json` engines, configure the environment to use Node 20 explicitly.
3. If the build step still fails, build the frontend separately in a Node 20 environment.
