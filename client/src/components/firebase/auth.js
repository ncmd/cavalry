import { auth } from './firebase';

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

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error Message:",errorCode,errorMessage);
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
