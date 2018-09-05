import firebase from 'firebase/app';
import 'firebase/auth';


const prodConfig = {
    apiKey: "AIzaSyBT_3Ftrn7uRH8Eg08JoY3s6lXO4rH2IIU\n",
    authDomain: "cavalry-app-prod.firebaseapp.com",
    projectId: "cavalry-app-prod",
};

const devConfig = {
    apiKey: "AIzaSyB-AnPL_ugVk5oUSRMMbn1BH6dS4Wf4iGU\n",
    authDomain: "cavalry-app-dev.firebaseapp.com",
    projectId: "cavalry-app-dev",
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
