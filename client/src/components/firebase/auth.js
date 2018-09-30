import { auth,db,storage } from './firebase';
import axios from 'axios';

const keys = require('../../secrets/keys');
let backend = keys.heroku_backend_uri


export const testAdd = () => {
  db.collection("black").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

export const uploadImageForPost = (uploadfile,pathfilename) => {

  // Create a reference to 'posts/accountid/filename.jpg'
  var imageImagesRef = storage.child(pathfilename);

  var file = uploadfile
  var promise = new Promise(function(resolve, reject) {
    resolve(imageImagesRef.put(file).then(function(snapshot) {
      console.log("Image uploaded!")
      })
    );})

  return promise.then((url) => {
  console.log("Finished promise uploadImageForPost")
  // return getImageUrl(pathfilename)
  })


}

export const getImageUrl = (pathfilename) => {

  var imageImagesRef = storage.child(pathfilename);
  var promise = new Promise(function(resolve, reject) {
    resolve(imageImagesRef.getDownloadURL().then(function(url) {
      // console.log(url)
      return url
      })
    );})

  return promise.then((url) => {
  console.log("Finished promise getImageUrl")
  return url
  })

}

export const addMemberToOrganization = (organizationname,newmember) => {
  var membersRef = db.collection("organizations").doc(organizationname);

  membersRef.get().then(function(doc) {
      if (doc.exists) {
        var prevMember  = doc.data().members.slice()
        if (prevMember.indexOf(newmember) > -1){
          console.log("Member Exists!", prevMember.indexOf(newmember))
        } else {
          prevMember.push(newmember)
          console.log("Successfully added Member!")
          return membersRef.update({
                members: prevMember
            }).then(function() {
              console.log("Document successfully updated!");
          })
          .catch(function(error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
        }

      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

}


export const getOrganizationMembers = (organizationname) => {
    var membersRef = db.collection("organizations").doc(organizationname);
    membersRef.get().then(function(doc) {
        if (doc.exists) {
            return doc.data().members
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

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

export const getJWTVerifyToken = () => {
  auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.

        // Now verify JWT with backend
      user.getIdToken().then(function(data) {
        // console.log("Got Token:",data)
        let newdata = {token:data}
        axios.post(backend+'/api/verify',newdata);
        // console.log("Response from backend:",res)
      });
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
