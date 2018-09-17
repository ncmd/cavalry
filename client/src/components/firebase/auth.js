import { auth } from './firebase';

const keys = require('../../secrets/keys');

// Check if email exists
export const checkEmailExists = (email) =>
    auth.fetchSignInMethodsForEmail(email).then((response) => {
        return response
});

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password).then( () => {
        return null
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error Message:",errorCode,errorMessage);
        return errorMessage
    });

// Signin with Link
export const actionCodeSettings = {
  url: keys.firebase_heroku_backend
};

export const doSendSignInLinkToEmail = (email, actionCodeSettings) =>
    auth.sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
    });

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error Message:",errorCode,errorMessage);
        return errorMessage
    }, ()=> {
      //set session
      auth.setPersistence(auth.Auth.Persistence.LOCAL).then(function() {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.

      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode,errorMessage)
        });

      });

export const doGetCurrentUser = () => {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      return user
      // User is signed in.
    } else {
      return null
    }
  });

}


// Sign out
export const doSignOut = () =>
    auth.signOut().then( () => {
      console.log("Signing out!")
        return null
    }).catch(function(error) {
        // Handle Errors here.
        console.log("Error Message:",error);
        return error
    });

// Password Reset
export const doPasswordReset = (email) =>
    auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);
