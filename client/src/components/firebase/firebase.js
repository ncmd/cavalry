import firebase from 'firebase/app';
import 'firebase/auth';


const prodConfig = {
    apiKey: "AIzaSyB-AnPL_ugVk5oUSRMMbn1BH6dS4Wf4iGU\n",
    authDomain: "cavalry-app.firebaseapp.com",
    projectId: "cavalry-app",
};

const devConfig = {
    apiKey: "AIzaSyB-AnPL_ugVk5oUSRMMbn1BH6dS4Wf4iGU\n",
    authDomain: "cavalry-app.firebaseapp.com",
    projectId: "cavalry-app",
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