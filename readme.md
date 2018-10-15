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
- nodejs v10.10.0 (windows) 9/18/18
- yarn 1.10.x (windows)

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
- GIT PATH
- NODE PATH
- YARN PATH
- HEROKU PATH
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
- Todo

# Algolia setup
- You need to create an Indicies first before being able to add data to it
- Relies on serverless/
- https://firebase.google.com/docs/firestore/solutions/search
- when a record is written in firestore, create it in algolia database
- when creating functions, be sure to reduce the memory allocated and timeout

# Google Analytics Proxy
- https://medium.freecodecamp.org/save-your-analytics-from-content-blockers-7ee08c6ec7ee
- Edit node_modules source:
- cd client & npm install ncmd/react-ga
- edited 'react-ga' src/utils/loadGA.js
- edited 'react-ga' dist/react-ga.js
- create analytics.js, replace all www.google-analytics.com with "+location.host+"/analytics
- put analytics.js in public/ directory
- setup firebase client to rewrite to a function: redirectHeroku for production
- "rewrites": [
-  {
-    "source": "!/api/\**",
-    "destination": "/index.html"
-  },{
-    "source": "/api/analytics/\**",
-    "function": "redirectHeroku"
-  }
- ]

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

# Travis setup
- Signin and Activate on cavalry repository
- https://github.com/travis-ci/travis.rb#windows
- Download Ruby https://github.com/oneclick/rubyinstaller2/releases/download/rubyinstaller-2.4.4-2/rubyinstaller-devkit-2.4.4-2-x64.exe
- Install module 1 only
- gem install travis -v 1.8.9 --no-rdoc --no-ri
- travis login --pro
- use github creds + 2-factor
- cd cavalry/
- heroku auth:token
- copy this token
- travis setup heroku --force
- Heroku API token: ************************************
- Heroku application name: |cavalry| cavalry-app-travis
- Deploy only from ncmd/cavalry? |yes|
- Encrypt API key? |yes|

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
- when creating functions, be sure to reduce the memory allocated and timeout

# Edit function Timeout
- https://console.cloud.google.com/functions/list

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

# React Native Setup with Expo
- Download Ubuntu from Windows Store
- Powershell: Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
- Download and Install Android Studio
- Download and Install latest version of Yarn
- Confirm Nvidia performance is high for qemu-system-x86_x64.exe
- Android Studio > Tools > SDK Manager > Android SDK > SDK Tools > Android SDK Build-Tools
- Create Android Virtual Device
- Pixel 2 API 23
- Cores 6, RAM 3536, VMHeap 1256
- npm install -g expo-cli react-native-cli
- expo init native
- react-native upgrade
- react-native link
- cd native && npm start
- Close app on virtual device, restart app in expo; press 'a'

# Native packages
- npm install react-navigation@2.0.4 react-native-swiper native-base --save
- npm install
- npm audit fix

# Slack Setup
- create bot: Bot Users page > cavalry-bot
- token used: OAuth & permissions page > Bot User OAuth Access Token
- Scopes:
- client, channels:read, incoming-webhook, bot, users:read
- Getting Legacy Token: https://medium.com/@andrewarrow/how-to-get-slack-api-tokens-with-client-scope-e311856ebe9
- create a redirect_uri; Manage Distribution > Add OAuth Redirect URLs >
- get client_id; Basic Information > App Credentials
- get workspace_name
- https://[workspace_name].slack.com/oauth/authorize?client_id=[client_id]&scope=client&redirect_uri=[redirect_url]

# Ngrok Setup
- Ngrok File location:
- C:\Users\f/.ngrok2/ngrok.yml
- ./ngrok http 80

# To Do ; Security
- Fix dangerouslySetInnerHTML
- rate limiting
- confirm pages with JWT
- session timeout
- reset password
- 2 factor


# To Do
## High Priority $$$
- search bar
- add history of when runbook is executed
- add history when objectives are assigned
- survive reddit hug of death
- survive producthunt
- Hacker News
- The Next Web
- sending Invoices - 10%
- assigning objectives - 70%
- upgrade subscription - 0%
- Make Account Management Look like Algolia's - 20%
- Creator of Runbook information added - 0%
- Assigning to all users once all selected - 20%
- Send notifications to everyone when they are assigned objective - 0%
- When objective is assigned, notify user in real-time - 0%
- Closing Run (sometimes it closes) - 80%
- Watch Runbook feature (see real-time progress) - 0%
- Posts infinite scroll - 0%
- Identify leaders - 0%
- Identify member skills and project owners - 0%
- enterprise grade - https://www.enterpriseready.io/#
- github style contributions - 5%
- Mobile notifications - 0%
- Email notifications when assigned - 0%
- save runbook before publish - 0%
- Slack integration - 0%
- revisions - 0%
- versions - 0%
- real-time collaboration - 0%
- adding objectives from other runbooks - 0%
- posts spam prevention - 0%
- requests spam prevention - 0%
- clone spam prevention - 0%
- upvote downvote - 0%

## Low Priority
- manage team - 10%
- implement experience level
- implement skills
- runbook categories
- Filter by team
- Filter by public vs private
- organization management - 70%
- filter by tag - 80%
- filter by assignee
- same sorting as reddit (popular trending)
- watch requests
- redirect unauthorized - 70%
- request a runbook - 85%
- assign to multiple department
- reset user password with email
- time estimation per runbook
- runbook: preparation phase
- runbook: post mortem lessons learned
- runbook: detection
- runbook: mitigation
- runbook: prevention
- runbook: contacts
- Auto-populate objectives using google/wikihow results
- Too much manual content creation
- Fix Search, perhaps only show results instead of editing the entire landing page
- Need to send out email to user when they paid for product and receipt
- Need to send out an email to users when they subscribe
- The edit form seems to always be different from when the view it later. Is it possible to be consistent
- When viewing on mobile, it looks soooo bad
- There are sometimes delays when rendering the landing page runbooks and viewing the runbook
- (Narrowed down issue because heroku shutdown after 30min of inactivity)
- Need to see all their posts they created
- Add comments on runbooks
- Add comments on objectives
- Add ratings on runbooks
- Add ratings on objectives
- Need private only runbooks
- Need offline version because they do not want to share information to public
- Phone text integration
- Mobile App React Native
- "Make the mobile app to get the alerts!"
- Consider making training material for people to learn security tasks
- Add area to get customer's support
- Create a Slack/Discord Chat community
- tech debt checklist
- Feature Request
- email notifications
- Success Critera
- Signup with linkedin
- Signup with google
- Signup with facebook
- Signup with twitter
- remove member of organization
- leave organization
- emailing
- creating community/cult
- share on linkedin
- rxjs
- websockets

## Complete
- cancel subscription - done
- user management - done
- add light theme - done
- add dark theme - done
- support email - done
- account details - done
- current plan; done
- cancel subscription - done
- preview - done
- create organization - done
- invite member to organization - done

## MISC
- github friendly
- websockets - gorilla
- Reference Resilient IBM
- craft http requests
- Add a flow where people can show added by/edited by in real time tracking (on the checklist feature)
- design simple
- failure to sign-in
- replicate prod database to dev and local
- Roadmap https://cavalrytactics.rikko.io/
- Digitalocean credits: https://www.digitalocean.com/hatch/

# Metrics
- https://analytics.google.com/analytics/web/#/savedreport/fuVSPoQYQJG5vOkiQ_KSOw/a123951173w182313602p180023379/_.advseg=&_.useg=&_.sectionId=&_r.dsa=1&metric.type=5/
- recaptcha: https://www.google.com/recaptcha/admin#site/342465358
- google analytics: https://analytics.google.com/analytics/web/
- mixpanel: https://mixpanel.com/report/1717377/segmentation#learn
- stripe: https://dashboard.stripe.com/test/billing
- firebase:
- firestore:
- algolia: https://www.algolia.com/apps/43JRRJRQRC/explorer/stats/posts

# Community
- slack: https://cavalry-tactics.slack.com/messages/CCKFY87FV/
- google groups: https://groups.google.com/forum/#!forum/cavalry-tactics

# Common Issues
-

# Anki Setup
- Website: https://ankiweb.net
- Download Desktop app version 2.1 https://ankiweb.net
- Addons:
- Night Mode
- Progress Bar
- Speed Focus Mode auto-alert auto-reveal auto-fail
- Syntax highlighting for Code
- loadbalancer
