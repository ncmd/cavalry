## New Computer Setup (Windows) (eta 30-minutes)

1. Install Chocolately (eta 1-minute)
- cmd.exe - run as administrator
```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

2. Install Python 3.x and Git (eta 1-minute)
```
choco install python3 git.install -y
refreshenv
```

3. Run Python TEST Script and Setup Script as Administrator (eta 10-minutes)
- cmd.exe - run as administrator
- Confirm Test Script passes all test with 'OK'
```
cd cavalry
python test_setup.py
python setup.py
```

4. Start VSCode, Setup VSCode Theme, and Install Extensions (eta 1-minute)
- File > Preferences > Color Theme > Install Additional Color Theme > Monokai ST3 0.1.2
- === Extensions:
- Monokai ST3
- Python
- Go
- ES7 React/Redux/GraphQL/React-Native snippets
- === Current Workspace Path:
- C:\Users\test\go\src\cavalry

5. Install Dropbox 61.4 (eta 1-minute)
- User: Main Email
- https://www.dropbox.com/download?os=win
- Location: C:\Users\test\Documents\Dropbox
- Backup Target: C:\Users\test\go\src\cavalry

6. Install Google Drive Backup 3.43 (eta 1-minute)
- User: Main Email
- https://www.google.com/drive/download/
- Backup Target: C:\Users\test\Documents\Dropbox\cavalry

7. Install FreeFileSync 10.6  (eta 1-minute)
- https://freefilesync.org/download/FreeFileSync_10.6_Windows_Setup.exe
- Sync Target: C:\Users\test\go\src\cavalry > C:\Users\test\Documents\Dropbox\cavalry
- Ignore Files:
``` 
\System Volume Information\
\$Recycle.Bin\
\RECYCLER\
\RECYCLED\
*\desktop.ini
*\thumbs.db
node_modules
*\node_modules\
*\vendor\
*\.dropbox.cache\
\.dropbox
\package-lock.json
*\google.golang.org\
*\firebase.google.com\
*\go.opencensus.io\
*\contrib.go.opencensus.io\
*\cloud.google.com\
*\.git\
.driveupload
*\.temp.drivedownload
*\.tmp.drivedownload
*\*.driveupload
*\client\build\
*\client\.firebase\
*\server\Godeps\
*\server-dev\Godeps\
*\server-prod\Godeps\
*package-lock.json
*.exe
*\server\vendor
*\server\Godeps
*\server-dev\vendor
*\server-dev\Godeps
*\server-prod\vendor
*\server-prod/Godeps
*\server\vendor
*\server\Godeps\
*\server-dev\vendor\
*\server-dev\Godeps\
*\server-prod\vendor\
*\server-prod\Godeps\
```
9. Sync Keys from Dropbox/GoogleDrive (eta 1-minute)
- Download 'cavalry' from Dropbox or GoogleDrive
- Sync Target: C:\Users\test\Documents\Dropbox\cavalry > C:\Users\test\go\src\cavalry
- Important Files:
```
client/src/secrets/keys_dev.js
client/src/secrets/keys_local.js
client/src/secrets/keys_prod.js
server/config/config.toml
server-dev/config/config.toml
server-prod/config/config.toml
serverless/config/config.toml
server/firestore.json
server-dev/firestore.json
server-prod/firestore.json
```
10.  You need to do a refresh of all Servers (eta 2-minutes)
```
cd server
heroku login
run-s heroku-backend-refresh-local heroku-backend-refresh-dev heroku-backend-refresh-prod
```

11. Login to Firebase with Google Auth (eta 1-minute)
```
cd client
firebase login
```
- firebase init > Hosting > cavalry-app > build > no
- Confirm all the keys client/secrets/keys*


12. Test Deploy Frontend (eta 5-minutes)
- You should be already authenticated to Firebase
```
cd client
firebase login
npm run deploy-frontend-local
```

13. Test Deploy Backend (eta 5-minutes)
- You should be already authenticated to Heroku
```
cd server
heroku login
npm run deploy-backend-local
```

# Day-to-Day
## Update latest React-Scripts Packages
- https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md#migrating-from-023-to-030
```
npm install --save --save-exact react-scripts@2.1.1
```
## Work on ToDo List
```
npm run local-frontend  | gnomon --type=elapsed-total --medium=20.0 --high=60.0 --ignore-blank --realtime=false
npm run local-backend | gnomon --type=elapsed-total --medium=20.0 --high=60.0 --ignore-blank --realtime=false
```
## Commiting code to Github
```
npm run commit
```
## Automated Real-time Sync with Dropbox
- BatchRun.ffs_batch
## Automated Real-time Sync with server/server-dev/server-prod
- BatchRunLocalSyncDev.ffs_batch
- BatchRunLocalSyncProd.ffs_batch
## Removing Files from Git
```
git rm -r --cached C:\Users\test\go\src\cavalry\<file_or_directory_name>
```
## Configure Nodejs Script (cavalry/package.json)
- Edit cavalry/package.json
- Automate as much as possible
## Running App locally
```
npm run local | gnomon --type=elapsed-total --medium=20.0 --high=60.0 --ignore-blank --realtime=false
```
# Deployment
```
npm run deploy-frontend-prod  | gnomon --type=elapsed-total --medium=20.0 --high=60.0 --ignore-blank --realtime=false
npm run deploy-backend-prod  | gnomon --type=elapsed-total --medium=20.0 --high=60.0 --ignore-blank --realtime=false
```
# Backup
```
npm run backup-all-x | gnomon --type=elapsed-total --medium=20.0 --high=60.0 --ignore-blank --realtime=false
```

# MVP Goals

## Web
- User Accounts
- force log out if more than 1 user
- Posts
- Search
- Chat
- Filter
- Payments
- Subscriptions
- JWT Authenticated Pages
- Filtering by Tag
- Vote System
- Comments
- Advertising Placement
- Sponsors

# Incident response phases
## 1. Preparation
- Develop and Document IR Policies: Establish policies, procedures, and agreements for incident response management.
- Define Communication Guidelines: Create communication standards and guidelines to enable seamless communication during and after an incident.
- Incorporate Threat Intelligence Feeds: Perform ongoing collection, analysis, and synchronization of your threat intelligence feeds.
- Conduct Cyber Hunting Exercises: Conduct operational threat hunting exercises to find incidents occurring within your environment. This allows for more proactive incident response.
- Assess Your Threat Detection Capability: Assess your current threat detection capability and update risk assessment and improvement programs.
Resources:
http://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf
https://www.sans.org/reading-room/whitepapers/incident/incident-handling-annual-testing-training-34565
## 2. DETECTION AND REPORTING
- Monitor: Monitor security events in your environment using firewalls, intrusion prevention systems, and data loss prevention.
- Detect: Detect potential security incidents by correlating alerts within a SIEM solution.
- Alert: Analysts create an incident ticket, document initial findings, and assign an initial incident classification.
- Report: Your reporting process should include accommodation for regulatory reporting escalations.
## 3. TRIAGE AND ANALYSIS
Endpoint Analysis
- Determine what tracks may have been left behind by the threat actor.
- Gather the artifacts needed to build a timeline of activities.
- Analyze a bit-for-bit copy of systems from a forensic perspective and capture RAM to parse through and identify key artifacts to determine - - what occurred on a device.
Binary Analysis
- Investigate malicious binaries or tools leveraged by the attacker and document the functionalities of those programs. This analysis is performed in two ways.
- Behavioral Analysis: Execute the malicious program in a VM to monitor its behavior
- Static Analysis: Reverse engineer the malicious program to scope out the entire functionality.
Enterprise Hunting
- Analyze existing systems and event log technologies to determine the scope of compromise.
- Document all compromised accounts, machines, etc. so that effective containment and neutralization can be performed.
## 4. CONTAINMENT AND NEUTRALIZATION
- Coordinated Shutdown: Once you have identified all systems within the environment that have been compromised by a threat actor, perform a coordinated shutdown of these devices. A notification must be sent to all IR team members to ensure proper timing.
- Wipe and Rebuild: Wipe the infected devices and rebuild the operating system from the ground up. Change passwords of all compromised accounts.
- Threat Mitigation Requests: If you have identified domains or IP addresses that are known to be leveraged by threat actors for command and control, issue threat mitigation requests to block the communication from all egress channels connected to these domains.
## 5. POST-INCIDENT ACTIVITY
- Complete an Incident Report: Documenting the incident will help to improve the incident response plan and augment additional security measures to avoid such security incidents in the future.
- Monitor Post-Incident: Closely monitor for activities post-incident since threat actors will re-appear again. We recommend a security log hawk analyzing SIEM data for any signs of indicators tripping that may have been associated with the prior incident.
- Update Threat Intelligence: Update the organization’s threat intelligence feeds.
- Identify preventative measures: Create new security initiatives to prevent future incidents.
- Gain Cross-Functional Buy-In: Coordinating across the organization is critical to the proper implementation of new security initiatives.
Resource: https://info.digitalguardian.com/rs/768-OQW-145/images/Incident-Response-eBook-teaser.pdf
## Mobile
- Notifications
- Comments
- Vote Systems

# To Do

## Bugs
- Frontend - cancel reply; not working in general
- Backend - error verifying ID token: ID token issued at future timestamp: 1543020011
- Frontend - drawer button not responding (in mobile and tablet mode)
- Frontend - Frontend - activity should not require you to be in an organization
- Frontend - forceupdate happening if banner typist is interrupted
- Frontend - in /teams when you click on react-select dropdown, the overlay is hidden

## Payments & Subscriptions
- sending Invoices - 10%
- ending subscription

## Posts
- max length on accordian...
- version control...
- editing post should open up the editor within objectives preview
- publishing should prompt user before publish
- attaching files
- deleting old unused pictures
- restricting access to pictures of private posts
- voting system for objectives
- suggest objective
- versioning and edits
- remember to fix editing page
- star post
- expand/unexpand all objectives
- change URL scheme to be: 
- Personal cavalry.com/username/post-title
- Category cavalry.com/category-name/post-title
- metrics (last edited, forks, views, stars, objectives, executions, comments)

## Comments
- view x replies; hide x replies
- show comments preview if not a member
- animation for collapsing
- show how to collapse/expand
- if more than 1 reply comment box is open, then the style for the other comment box toolbar is gone
- time posted
- unique id comments
- parent id 
- parent depth
- reply, remove old comment if reply; otherwise cancel will put it back to original state
- comments - 25%
- add comment to firestore
- delete comment in firestore
- dispatch to redux add comment
- dispatch to redux delete comment
- dispatch to redux edit comment
- thre should be something indicating collapse

## UI/UX
- header user drawer instead

## Search
- search bar - 10% - USE REDUX-SEARCH bvaughn.github.io
- filter bar ; top
- filter options

## Voting System
- racecondition occuring
- redux needs to fix the voting; something wrong; firestore is working for aggregation
- stars - 85% - Use redux, then make update to firestore; must only done once per user
- there needs to be a record of local user starring post
- redux should contain this information
- reducer action to add star on account store
- reducer action to remove star on account store

## Collaboration
- inviting users - 70% - does not look nice, reference slack and github
- assigning objectives - 70% - does not look nice, reference asana
- assigning all objectives to all users once all selected - 5%
- fix activity - presentation does not look nice
- request to join organization
- public user profile

# To Do ; Security
- Fix dangerouslySetInnerHTML
- Api scraping
- rate limiting
- confirm pages with JWT
- session timeout
- reset password
- 2-factor
- confirm redux clean

# Low Priority
- Cookie tracking
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

# MISC
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

# Setup

## Notes
- When signing up on local environment, use credit card #: 4242 4242 4242 4242
- You can use anything for expiration date, cvc, and postal code
## Metrics
- https://analytics.google.com/analytics/web/#/savedreport/fuVSPoQYQJG5vOkiQ_KSOw/a123951173w182313602p180023379/_.advseg=&_.useg=&_.sectionId=&_r.dsa=1&metric.type=5/
- recaptcha: https://www.google.com/recaptcha/admin#site/342465358
- google analytics: https://analytics.google.com/analytics/web/
- mixpanel: https://mixpanel.com/report/1717377/segmentation#learn
- stripe: https://dashboard.stripe.com/test/billing
- firebase:
- firestore:
- algolia: https://www.algolia.com/apps/43JRRJRQRC/explorer/stats/posts
## Main React Components
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

## Redux Setup
- Todo

## Google Analytics Proxy

- https://medium.freecodecamp.org/save-your-analytics-from-content-blockers-7ee08c6ec7ee
- Edit node_modules source:
- cd client & npm install ncmd/react-ga
- edited 'react-ga' src/utils/loadGA.js
- edited 'react-ga' dist/react-ga.js
- create analytics.js, replace all www.google-analytics.com with "+location.host+"/analytics
- put analytics.js in public/ directory
- NOTE: If google analytics is not working in production; follow steps below
- setup firebase client to rewrite to a function: redirectHeroku for production
```
 "rewrites": [
  {
    "source": "!/api/\**",
    "destination": "/index.html"
  },{
    "source": "/api/analytics/\**",
    "function": "redirectHeroku"
  }
]
```
## Firebase Authentication Setup
- Enable email sign-in method
- Add authorized domain: cavalry-app.herokuapp.com
- Remember to limit the signup quota
- https://console.firebase.google.com/u/1/project/cavalry-app-prod/authentication/providers

## Server Setup:
```
npm run first-setup-go-all-x
User: jidokaus@gmail | C%
heroku login 
heroku git:remote -a cavalry-app
cd serverless/functions && npm install
```
## Server Heroku Config:
- Gopkg.toml = root-package = "cavalry/server-prod"
- Procfile = web: server-prod

## Recaptcha Configuration
- https://www.google.com/recaptcha/admin#site/342465358
- Source backend server changes, be sure to update to the list of allowed domains
- Also add owners
- Adjust to easiest for users

## Recover from Heroku Server
- server/config/config.toml
- server/firestore.json

## Serverless Setup:
- npm install -g firebase-tools
- cd serverless/
- firebase login
- firebase init functions
- DO NOT OVERWRITE ANYTHING
- cd serverless/functions
- npm install firebase-functions@latest firebase-admin@latest algolia-firebase-functions --save
- Confirm Algolia Keys (algolia.txt)
- when creating functions, be sure to reduce the memory allocated and timeout

## Edit function Timeout
- https://console.cloud.google.com/functions/list

## Project Cost
- Firebase Hosting (app size and data transferred)
- Firebase Firestore (reads and writes)
- Firebase Functions (runtime and memory)
- Domain (namecheap)
- Storage (photos and files)
- Authentication
- Stripe (limit $10, payment processing)

## Backup Setup
- backup & Restore: utilities/index.js
- files: utilities/firestore_dev_data.json & utilities/firestore_prod_data.json

## Firebase Firestore Notes:
- All client based functions for Firestore is in client/src/components/firebase/auth.js
- All serverless functions are in serverless/functions/index.js
- All utilities to backup data are in utilities/index.js
- All server side functions are in server/controllers_(posts/accounts/posts/requests/etc.)


## Community
- slack: https://cavalry-tactics.slack.com/messages/CCKFY87FV/
- google groups: https://groups.google.com/forum/#!forum/cavalry-tactics

# Depricated | Not in Use

## Algolia setup (Depricated)
- You need to create an Indicies first before being able to add data to it
- Relies on serverless/
- https://firebase.google.com/docs/firestore/solutions/search
- when a record is written in firestore, create it in algolia database
- when creating functions, be sure to reduce the memory allocated and timeout


## React Native Setup
- Download and Install Android Studio
- Download and Install latest version of Yarn
- Confirm Nvidia performance is high for qemu-system-x86_x64.exe
- Android Studio > Tools > SDK Manager > Android SDK > SDK Tools > Android SDK Build-Tools
- Create Android Virtual Device
- Pixel 2 API 23
- Cores 6, RAM 3536, VMHeap 1256

## Native packages
- npm install react-navigation@2.0.4 react-native-swiper native-base --save
- npm install
- npm audit fix

## Slack Setup (not in use)
- create bot: Bot Users page > cavalry-bot
- token used: OAuth & permissions page > Bot User OAuth Access Token
- Scopes:
- client, channels:read, incoming-webhook, bot, users:read
- Getting Legacy Token: https://medium.com/@andrewarrow/how-to-get-slack-api-tokens-with-client-scope-e311856ebe9
- create a redirect_uri; Manage Distribution > Add OAuth Redirect URLs >
- get client_id; Basic Information > App Credentials
- get workspace_name
- https://[workspace_name].slack.com/oauth/authorize?client_id=[client_id]&scope=client&redirect_uri=[redirect_url]

## Ngrok Setup (not in use)
- Ngrok File location:
- C:\Users\test/.ngrok2/ngrok.yml
- ./ngrok http 80

## Server Email Setup (depreciated; using sendgrid)
- Email: enable less secure app access https://myaccount.google.com/lesssecureapps
- and display unlock captcha http://www.google.com/accounts/DisplayUnlockCaptcha

## Travis setup (not setup properly; will do later)
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
