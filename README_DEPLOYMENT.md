
101ms
using build driver railpack-v0.35.0
uploading snapshot
12.8 MB
433ms
                   
╭─────────────────╮
│ Railpack 0.35.0 │
╰─────────────────╯
 
  ⚠ No node package manager detected, using npm
  ↳ Detected Node
  ↳ Using npm package manager
  ↳ Custom start command detected, skipping Caddy start
  → Add a `package-lock.json` for more deterministic installs https://railpack.com/architecture/recommendations
  ↳ Found web command in Procfile
            
  Packages  
  ──────────
  node  │  20.19.0  │  idiomatic-version-file (20.19.0)
            
  Steps     
  ──────────
  ▸ install
    $ npm install
         
  ▸ build
    $ npm run build
            
  Deploy    
  ──────────
    $ cd backend && npm start
 

load build definition from ./railpack-plan.json
0ms

install mise packages: node cached
0ms

copy .nvmrc cached
0ms

copy / /app
169ms

copy /mise/installs, /mise/shims, /root/.local/state/mise, /etc/mise/config.toml, /usr/local/bin/mise cached
0ms

install apt packages: libatomic1 cached
0ms

mkdir -p /app/node_modules/.cache
209ms

npm install
8s
npm warn config production Use `--omit=dev` instead.
> postinstall
> cd backend && npm install && cd ../frontend && npm install --include=dev && npm run build
npm warn config production Use `--omit=dev` instead.
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
added 168 packages, and audited 169 packages in 1s
2 high severity vulnerabilities
To address issues that do not require attention, run:
  npm audit fix
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
npm warn config production Use `--omit=dev` instead.
npm warn deprecated recharts@2.15.4: 1.x and 2.x branches are no longer active. Bump to Recharts v3 to receive latest features and bugfixes. See https://github.com/recharts/recharts/wiki/3.0-migration-guide
added 380 packages, and audited 381 packages in 4s
2 high severity vulnerabilities
To address all issues, run:
  npm audit fix
Run `npm audit` for details.
npm warn config production Use `--omit=dev` instead.
> build
> vite build
vite v8.1.4 building client environment for production...

transforming...
✓ 2021 modules transformed.
✗ Build failed in 830ms
error during build:
[31mBuild failed with 1 error:

[plugin vite:esbuild-transpile]
Error: Failed to load `transformWithEsbuild`. It is deprecated and it now requires esbuild to be installed separately. If you are a package author, please migrate to `transformWithOxc` instead.

    at transformWithEsbuild (file:///app/frontend/node_modules/vite/dist/node/chunks/node.js:3332:9)
    at async PluginContextImpl.renderChunk (file:///app/frontend/node_modules/vite/dist/node/chunks/node.js:3384:16)
    at async plugin (file:///app/frontend/node_modules/rolldown/dist/shared/bindingify-input-options-XPJLJOD0.mjs:1618:16)
    at async plugin.<computed> (file:///app/frontend/node_modules/rolldown/dist/shared/bindingify-input-options-XPJLJOD0.mjs:1959:12)
Caused by:
  Error: Cannot find package 'esbuild' imported from /app/frontend/node_modules/vite/dist/node/chunks/node.js
  Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'esbuild' imported from /app/frontend/node_modules/vite/dist/node/chunks/node.js
      at packageResolve (node:internal/modules/esm/resolve:873:9)
      at moduleResolve (node:internal/modules/esm/resolve:946:18)
      at defaultResolve (node:internal/modules/esm/resolve:1188:11)
      at nextResolve (node:internal/modules/esm/hooks:864:28)
      at u (file:///app/frontend/node_modules/@tailwindcss/node/dist/esm-cache.loader.mjs:1:69)
      at nextResolve (node:internal/modules/esm/hooks:864:28)
      at Hooks.resolve (node:internal/modules/esm/hooks:306:30)
      at MessagePort.handleMessage (node:internal/modules/esm/worker:196:24)
      at [nodejs.internal.kHybridDispatch] (node:internal/event_target:831:20)
      at MessagePort.<anonymous> (node:internal/per_context/messageport:23:28)
    at aggregateBindingErrorsIntoJsError (file:///app/frontend/node_modules/rolldown/dist/shared/error-BHRSI0R7.mjs:48:18)
    at unwrapBindingResult (file:///app/frontend/node_modules/rolldown/dist/shared/error-BHRSI0R7.mjs:18:128)
    at #build (file:///app/frontend/node_modules/rolldown/dist/shared/rolldown-build-CtPvmZgJ.mjs:3276:34)
    at async buildEnvironment (file:///app/frontend/node_modules/vite/dist/node/chunks/node.js:33011:66)
    at async Object.build (file:///app/frontend/node_modules/vite/dist/node/chunks/node.js:33433:19)
    at async Object.buildApp (file:///app/frontend/node_modules/vite/dist/node/chunks/node.js:33430:153)
    at async CAC.<anonymous> (file:///app/frontend/node_modules/vite/dist/node/cli.js:776:3) {
  errors: [Getter/Setter]
}
npm error code 1
npm error path /app
npm error command failed
npm error command sh -c cd backend && npm install && cd ../frontend && npm install --include=dev && npm run build
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-08-05T18_52_42_295Z-debug-0.log
scheduling build on Metal builder "builder-ngynwc"
Build Failed: build daemon returned an error < failed to solve: process "npm install" did not complete successfully: exit code: 1 >