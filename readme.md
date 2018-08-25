## Dev Environment

# Install:
- heroku
- git
- github desktop
- golang 1.11
- nodejs 8.11.4 LTS

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
- cd client && npm install --no-optional --no-shrinkwrap --no-package-lock && cd ..
- cd client && heroku login

# Server Setup:
- cd server/ && go get github.com/tools/godep && cd ..
- cd server/
- go get firebase.google.com/go
- go get google.golang.org/api/option
- go get github.com/stripe/stripe-go
- go get github.com/BurntSushi/toml

# Recover from Heroku Server
- server/config/config.toml
- server/firestore.json

# Serverless Setup:
- npm install -g firebase-tools
- cd serverless/
- firebase login
- firebase init functions
== DO NOT OVERWRITE ANYTHING

# Project Cost
- Firebase Hosting (app size and data transferred)
- Firebase Firestore (reads and writes)
- Firebase Functions (runtime and memory)
- Domain (namecheap)
- Storage (photos and files)
- Authentication
- Stripe (limit $10, payment processing)
