const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const keys = require('../../secrets/keys');

const config = {
    apiKey: keys.firebase_api_key,
    authDomain: keys.firebase_auth_domain,
    projectId: keys.firebase_project_id,
};

firebase.initializeApp({
  apiKey: keys.firebase_api_key,
  authDomain: keys.firebase_auth_domain,
  projectId: keys.firebase_project_id,
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
