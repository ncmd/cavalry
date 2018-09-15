import firebase from 'firebase/app';
import 'firebase/auth';
const keys = require('../../secrets/keys');

const config = {
    apiKey: keys.firebase_api_key,
    authDomain: keys.firebase_auth_domain,
    projectId: keys.firebase_project_id,
};

firebase.initializeApp(config);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
    auth,
};
