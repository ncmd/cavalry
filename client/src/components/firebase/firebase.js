import firebase from 'firebase/app';
import 'firebase/auth';
const keys = require('../../secrets/keys');

const prodConfig = {
    apiKey: keys.firebase_prod_api_key,
    authDomain: keys.firebase_prod_auth_domain,
    projectId: keys.firebase_prod_project_id,
};

const devConfig = {
    apiKey: keys.firebase_dev_api_key,
    authDomain: keys.firebase_dev_auth_domain,
    projectId: keys.firebase_dev_project_id,
};

const config = process.env.NODE_ENV === 'production'
    ? prodConfig
    : devConfig;


firebase.initializeApp(config);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
    auth,
};
