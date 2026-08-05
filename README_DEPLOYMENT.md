unpacking archive
14.1 MB
86ms
using build driver railpack-v0.35.0
uploading snapshot
12.8 MB
295ms
                   
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

copy .nvmrc
91ms

install mise packages: node
1s
mise node@20.19.0 ✓ installed

copy / /app
187ms

mkdir -p /app/node_modules/.cache
208ms

npm install
7s
npm warn config production Use `--omit=dev` instead.
> postinstall
> cd backend && npm install && cd ../frontend && npm install --include=dev && npm run build
npm warn config production Use `--omit=dev` instead.
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
added 168 packages, and audited 169 packages in 957ms
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
Warning: Invalid output options (1 issue found)
- For the "manualChunks". Invalid type: Expected Function but received Object. 

transforming...
✓ 2021 modules transformed.
✗ Build failed in 585ms
error during build:
[31mBuild failed with 1 error:

TypeError: manualChunks is not a function
    at name (file:///app/frontend/node_modules/rolldown/dist/shared/rolldown-build-CtPvmZgJ.mjs:3059:10)
    at name (file:///app/frontend/node_modules/rolldown/dist/shared/rolldown-build-CtPvmZgJ.mjs:3074:54)
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
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-08-05T18_44_09_026Z-debug-0.log

copy /mise/installs, /usr/local/bin/mise, /etc/mise/config.toml, /mise/shims cached
0ms

install apt packages: libatomic1 cached
0ms

copy /root/.local/state/mise
66ms
scheduling build on Metal builder "builder-ngynwc"
Build Failed: build daemon returned an error < failed to solve: process "npm install" did not complete successfully: exit code: 1 >