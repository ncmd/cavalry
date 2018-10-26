## Day 2 Day
# Running app locally
- npm run local
# Deployment
- npm run deploy-all-x
# Backup
- npm run backup-all-x

## Dev Environment

# 🔥🔥🔥 Important 🔥🔥🔥
- You will need to get the local,dev, and prod keys
- normal locations:
- client/src/secrets/keys_dev.js
- client/src/secrets/keys_local.js
- client/src/secrets/keys_prod.js
- server/config/config.toml
- server-dev/config/config.toml
- server-prod/config/config.toml
- serverless/config/config.toml

# Install:
- heroku cli
- git 2.18.0 (windows)
- github desktop
- golang 1.11.windows (windows)
- nodejs v8.12.0 LTS (windows)
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
--platformio-ide-terminal settings - Default Shell: C:\Windows\System32\cmd.exe

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

# Main React Components
- Components:
- Prime React: https://www.primefaces.org/primereact/#/organizationchart
- Fabric: https://developer.microsoft.com/en-us/fabric
- Blueprint: https://github.com/palantir/blueprint
- Carbon: https://github.com/IBM/carbon-components-react
- Material UI: https://material-ui.com/
- React-Virtualized: https://github.com/bvaughn/react-virtualized
- Reactstrap (bootstrap): https://reactstrap.github.io/
- Icons: https://material.io/tools/icons/
- Animation: https://digital-flowers.github.io/react-animated-css.html

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

# Travis setup (not setup properly; will do later)
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

# Server Email Setup (depreciated; using sendgrid)
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

# React Native Setup
- Download and Install Android Studio
- Download and Install latest version of Yarn
- Confirm Nvidia performance is high for qemu-system-x86_x64.exe
- Android Studio > Tools > SDK Manager > Android SDK > SDK Tools > Android SDK Build-Tools
- Create Android Virtual Device
- Pixel 2 API 23
- Cores 6, RAM 3536, VMHeap 1256

# Native packages
- npm install react-navigation@2.0.4 react-native-swiper native-base --save
- npm install
- npm audit fix

# Slack Setup (not in use)
- create bot: Bot Users page > cavalry-bot
- token used: OAuth & permissions page > Bot User OAuth Access Token
- Scopes:
- client, channels:read, incoming-webhook, bot, users:read
- Getting Legacy Token: https://medium.com/@andrewarrow/how-to-get-slack-api-tokens-with-client-scope-e311856ebe9
- create a redirect_uri; Manage Distribution > Add OAuth Redirect URLs >
- get client_id; Basic Information > App Credentials
- get workspace_name
- https://[workspace_name].slack.com/oauth/authorize?client_id=[client_id]&scope=client&redirect_uri=[redirect_url]

# Ngrok Setup (not in use)
- Ngrok File location:
- C:\Users\f/.ngrok2/ngrok.yml
- ./ngrok http 80

# Firebase Firestore Notes:
- All client based functions for Firestore is in client/src/components/firebase/auth.js
- All serverless functions are in serverless/functions/index.js
- All utilities to backup data are in utilities/index.js
- All server side functions are in server/controllers_(posts/accounts/posts/requests/etc.)

# To Do ; Security
- Fix dangerouslySetInnerHTML
- Api scraping
- rate limiting
- confirm pages with JWT
- session timeout
- reset password
- 2-factor
- confirm redux clean

# To Do
- editing posts in firebase - aggregation/posts
- serverless sync posts with aggregation
- sending Invoices - 10%
- bug: drawer button not responding (in mobile and tablet mode)
- bug: activity should not require you to be in an organization
- bug: forceupdate happening if banner typist is interrupted
- bug: in /teams when you click on react-select dropdown, the overlay is hidden

- change URL scheme to be: .com/username/post-title
- change react-quill editor to primereact version
- header user drawer instead
- search bar - 70% - USE REDUX-SEARCH bvaughn.github.io

- stars - 85% - Use redux, then make update to firestore; must only done once per user
- there needs to be a record of local user starring post

- redux should contain this information
- reducer action to add star on account store
- reducer action to remove star on account store

- inviting users - 70% - does not look nice, reference slack and github
- assigning objectives - 70% - does not look nice, reference asana

- assigning all objectives to all users once all selected - 5%

- fix activity - presentation does not look nice

- filter bar ; top
- filter options

- comments - 5%
- add comment to firestore
- delete comment in firestore
- dispatch to redux add comment
- dispatch to redux delete comment
- dispatch to redux edit comment

- ending subscription
- request to join organization
- public user profile

## Low Priority
- Add 404 page if it does not exist
- upgrade subscription - 0%
- add attachments
- category metrics
- backend redundancy/failsafe - 5%
- notification if backend goes down
- survive reddit hug of death
- survive producthunt
- survive Hacker News
- survive The Next Web
- save runbook before publish - 0%
- Slack integration - 0%
- real-time collaboration - 0%
- adding objectives from other runbooks - 0%
- posts spam prevention - 0%
- requests spam prevention - 0%
- clone spam prevention - 0%
- Mobile notifications - 0%
- Email notifications when assigned - 0%
- Send notifications to everyone when they are assigned objective - 0%
- When objective is assigned, notify user in real-time - 40%
- Closing Run (sometimes it closes) - 80%
- Watch Runbook feature (see real-time progress) - 0%
- Posts infinite scroll pagination - 0%
- Identify leaders - 0%
- Identify member skills and project owners - 0%
- enterprise grade - https://www.enterpriseready.io/#
- Make Account Management Look like Algolia's - 20%
- tree diagram creating runbook - 0%
- tree diagram show progress - 0%
- add history of when runbook is executed - 0%
- add history when objectives are assigned - 0%
- revisions - 0%
- versions - 0%
- runbook stars
- github style contributions - 5%
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
- post need time posted - done
- author of runbook - need a username - done
- create a username- need regex and character limitation - done
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
- there needs to be an array or values or objects containing a list of all users who starred post - done
- reducer action to add star on post store - done
- reducer action to remove star on post - done

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

# Notes:
- When signing up on local environment, use credit card #: 4242 4242 4242 4242
- You can use anything for expiration date, cvc, and postal code
