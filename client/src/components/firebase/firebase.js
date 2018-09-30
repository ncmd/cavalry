import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const keys = require('../../secrets/keys');


const config = {
    apiKey: keys.firebase_api_key,
    authDomain: keys.firebase_auth_domain,
    projectId: keys.firebase_project_id,
    storageBucket: keys.firebase_storage_bucket,
    databaseURL: keys.firebase_database_url,
};

firebase.initializeApp(config);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();
const store = firebase.storage();
const storage = store.ref();

db.settings({
  timestampsInSnapshots: true
});

export {
    auth,
    db,
    storage,
};
