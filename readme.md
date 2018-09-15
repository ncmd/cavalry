## Day 2 Day
# Running app locally
- npm run locally
# Deployment
- npm run deploy-all-x
# Backup
- npm run backup-all-x

## Dev Environment

# Install:
- heroku cli
- git 2.18.0 (windows)
- github desktop
- golang 1.11.windows (windows)
- nodejs 8.11.4 LTS (windows)
- yarn 1.9.4 (windows)

# Node -g packages
- npm install -g concurrently
- npm install -g cross-var
- npm install -g firebase-tools
- npm install -g npm-run-all

# Atom Packages:
- go-plus
- react
- platformio-ide-terminal
--Default Shell: C:\Windows\System32\cmd.exe

# Setup Paths:
GIT PATH
NODE PATH
YARN PATH
HEROKU PATH
- C:\Program Files\Heroku\bin
GO PATH
- C:\Users\username\go
GOROOT
- C:\go
PROJECT PATH
- C:\Users\username\go\src\cavalry

# Client Setup:
- cd client/
- npm install eslint@^4.1.1 && npm install --no-optional --no-shrinkwrap --no-package-lock
- firebase login
- firebase init; build, yes, no
- setup all the keys client/secrets/keys_dev.js

# Redux Setup
-

# Firebase Authentication Setup
- Enable email sign-in method
- Add authorized domain: cavalry-app.herokuapp.com
- Remember to limit the signup quota
- https://console.firebase.google.com/u/1/project/cavalry-app-prod/authentication/providers

# Server Setup:
- cd server/
- go get -v golang.org/x/tools/cmd/goimports
- go get github.com/tools/godep
- go get golang.org/x/sys/unix
- go get firebase.google.com/go
- go get google.golang.org/api/option
- go get github.com/stripe/stripe-go
- go get github.com/BurntSushi/toml
- heroku login
- heroku git:remote -a cavalry-app
- cd server/functions npm install firebase-functions@latest firebase-admin@latest algolia-firebase-functions --save

# Server Email Setup:
- Email: enable less secure app access https://myaccount.google.com/lesssecureapps
- and display unlock captcha http://www.google.com/accounts/DisplayUnlockCaptcha

# Server Heroku Config:
- Gopkg.toml = root-package = "cavalry/server-prod"
- Procfile = web: server-prod


# Recaptcha Configuration
- https://www.google.com/recaptcha/admin#site/342465358
- Source backend server changes, be sure to update to the list of allowed domains
- Also add owners
- Adjust to easiest for users

# Recover from Heroku Server
- server/config/config.toml
- server/firestore.json

# Serverless Setup:
- npm install -g firebase-tools
- cd serverless/
- firebase login
- firebase init functions
- DO NOT OVERWRITE ANYTHING
- cd serverless/functions
- npm install firebase-functions@latest firebase-admin@latest algolia-firebase-functions --save
- Confirm Algolia Keys (algolia.txt)

# Project Cost
- Firebase Hosting (app size and data transferred)
- Firebase Firestore (reads and writes)
- Firebase Functions (runtime and memory)
- Domain (namecheap)
- Storage (photos and files)
- Authentication
- Stripe (limit $10, payment processing)

# Backup Setup
- backup & Restore: utilities/index.js
- files: utilities/firestore_dev_data.json & utilities/firestore_prod_data.json

# To Do
- cancel subscription
- upgrade subscription
- reset user password with email
- survive reddit hug of death
- survive producthunt
- time estimation per runbook
- runbook: preparation phase
- runbook: post mortem lessons learned
- runbook: detection
- runbook: mitigation
- runbook: prevention
- runbook: contacts
- add day theme
- request a runbook
- Auto-populate objectives using google/wikihow results
- Too much manual content creation
- Fix Search, perhaps only show results instead of editing the entire landing page
- Need to send out email to user when they paid for product and receipt
- Need to send out an email to users when they subscribe
- The edit form seems to always be different from when the view it later. Is it possible to be consistent
- When viewing on mobile, it looks soooo bad
- There are sometimes delays when rendering the landing page runbooks and viewing the runbook
(Narrowed down issue because heroku shutdown after 30min of inactivity)
- Need to see all their posts they created
- Add comments on runbooks
- Add comments on objectives
- Add ratings on runbooks
- Add ratings on objectives
- Need private only runbooks
- Need offline version because they do not want to share information to public
- Slack integration
- Phone text integration
- Mobile App React Native

# Metrics
- recaptcha: https://www.google.com/recaptcha/admin#site/342465358
- google analytics: https://analytics.google.com/analytics/web/
- mixpanel: https://mixpanel.com/report/1717377/segmentation#learn
- stripe: https://dashboard.stripe.com/test/billing
- firebase:
- firestore:
- algolia: https://www.algolia.com/apps/43JRRJRQRC/explorer/stats/posts
