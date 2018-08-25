## Dev Environment

# Install:
- heroku cli
- git 2.18.0 (windows)
- github desktop
- golang 1.11.windows (windows)
- nodejs 8.11.4 LTS (windows)
- yarn 1.9.4 (windows)

# Atom Packages:
- go-plus
- react
- platformio-ide-terminal

# Setup Paths:
GIT PATH
HEROKU PATH
GOPATH
- C:\Users\username\go
PROJECT PATH
- C:\Users\username\go\src\cavalry

# Client Setup:
- cd client/
- npm install eslint@^4.1.1 && npm install --no-optional --no-shrinkwrap --no-package-lock
- heroku login

# Server Setup:
- cd server/
- go get github.com/tools/godep
- go get golang.org/x/sys/unix
- go get firebase.google.com/go
- go get google.golang.org/api/option
- go get github.com/stripe/stripe-go
- go get github.com/BurntSushi/toml
- heroku git:remote -a cavalry-app

# Recover from Heroku Server
- server/config/config.toml
- server/firestore.json

# Serverless Setup:
- npm install -g firebase-tools
- cd serverless/
- firebase login
- firebase init functions
== DO NOT OVERWRITE ANYTHING
- cd serverless/functions
- npm install firebase-functions@latest firebase-admin@latest --save

# Project Cost
- Firebase Hosting (app size and data transferred)
- Firebase Firestore (reads and writes)
- Firebase Functions (runtime and memory)
- Domain (namecheap)
- Storage (photos and files)
- Authentication
- Stripe (limit $10, payment processing)
