Source
Source Repo
shanatpandey44-max/ipm



Disconnect
Add Root Directory (used for build and deploy steps. Docs↗)
Branch connected to production
Changes made to this GitHub branch will be automatically pushed to this environment.
main

Disconnect
Auto deploys when pushed to GitHub

Disable
Wait for CI
Trigger deployments after all GitHub actions have completed successfully.

Networking
Public Networking
Access your application over HTTP with the following domains
ipm-production.up.railway.app
Port 5000





Domain
ipm-production
.up.railway.app

5000
Update your domain or target port


Cancel

Update

Custom Domain

TCP Proxy
Private Networking
Communicate with this service from within the Railway network.
ipm.railway.internal
IPv4 & IPv6


Ready to talk privately ·
You can also simply call me
ipm

DNS
ipm
.railway.internal

Endpoint name available!


Cancel

Update
Outbound IPv6
Enable your service to make outbound connections to IPv6 destinations.

Edge
Under Attack Mode
Being DDoSed? One click puts a browser check in front of your domains, shedding bot floods at the edge. Real visitors solve it once and browse normally.
Until turned off

Activate
Takes effect across the globe in ~20 seconds.

CDN Caching
Cache static assets and optionally HTML at the edge. Reduces latency and origin load for your service's domains.

Scale
Regions & Replicas
Deploy replicas per region for horizontal scaling.
US West (California, USA)

Replicas
1
Replica
Multi-region replicas are only available on the Pro plan.

Learn More↗
Replica Limits
Allocate a maximum vCPU and Memory for each replica.
CPU: 2 vCPU

Plan limit: 2 vCPU


Memory: 1 GB

Plan limit: 1 GB


Upgrade for higher limits
Build
Builder

Railpack

Default

20.19.0node@20.19.0
App builder developed by Railway. Docs↗

Custom Build Command
Override the default build command that is run when building your app. Docs↗

Build Command
Watch Paths
Gitignore-style rules to trigger a new deployment based on what file paths have changed. Docs↗
Add pattern
Add pattern e.g. /src/**

Deploy
Custom Start Command
Command that will be run to start new deployments. Docs↗

Start Command
Add pre-deploy step (Docs↗)
Teardown