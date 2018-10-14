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
      // console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}


export const addAccountActivityFirestore = (organizationname,accountid,index) => {

  var accountRef = db.collection("account").doc(accountid);
  accountRef.get().then(function(doc) {
      if (doc.exists){
        // var prevActivity = doc.data().organizatioactivity
      //   prevActivity.forEach(function(element, index, theArray) {
      //     if (index === thisindex){
            console.log("Account,",doc)
      //       theArray[index] = {
      //         accountid: element.accountid,
      //         department: department,
      //         emailaddress: element.emailaddress,
      //         status: element.status,
      //       }
      //     }
      //
      //   });
      // console.log("changeOrgMemberDepartmentFirestore PrevMembers:",prevActivity)

      // now set firestore with new document
      // accountRef.update({
      //   activity: prevAccount
      // })

      }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });
}

export const filterPostByTag = (tagname) => {
  // console.log(tagname)
  const  postsRef = db.collection("posts");

  let foundPosts = []

  var promise = new Promise(function(resolve, reject) {
    resolve(postsRef.where("tags", "array-contains", tagname).get().then(function(filterPostResults) {
      filterPostResults.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          foundPosts.push(doc.data())
      });
      })
    );})

  return promise.then(() => {
    // console.log("Finished",foundPosts)
    return foundPosts
  })

}

export const uploadImageForPost = (uploadfile,pathfilename) => {

  // Create a reference to 'posts/accountid/filename.jpg'
  var imageImagesRef = storage.child(pathfilename);

  var file = uploadfile
  var promise = new Promise(function(resolve, reject) {
    resolve(imageImagesRef.put(file).then(function(snapshot) {
      // console.log("Image uploaded!")
      })
    );})

  return promise.then((url) => {
  // console.log("Finished promise uploadImageForPost")
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
  // console.log("Finished promise getImageUrl")
  return url
  })

}

export const loadOrganization = (organizationname) => {
  // console.log(organizationname)
  if (organizationname !== ""){
    const postsRef = db.collection("organizations").doc(organizationname);
    let foundAccount = []
    var promise = new Promise(function(resolve, reject) {
      resolve(postsRef.get().then(function(doc) {
        if (doc.exists) {
          // console.log(doc.data())
          return doc.data()
        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
            return []
      }
        })
      );})

    return promise.then((data) => {
      // console.log("Finished",data)
      return data
    })
  }

}

export const changeOrgMemberDepartmentFirestore = (organizationname,thisindex,department) => {
  var membersRef = db.collection("organizations").doc(organizationname);

  membersRef.get().then(function(doc) {
      if (doc.exists){
        var prevMembers = doc.data().organizationmembers
        prevMembers.forEach(function(element, index, theArray) {
          if (index === thisindex){
            // console.log("PartIndexArray",element,index)
            theArray[index] = {
              accountid: element.accountid,
              department: department,
              emailaddress: element.emailaddress,
              status: element.status,
            }
          }

        });
      // console.log("changeOrgMemberDepartmentFirestore PrevMembers:",prevMembers)

      // now set firestore with new document
      membersRef.update({
        organizationmembers: prevMembers
      })

      }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });

}

export const addMemberToOrganization = (organizationname,emailaddress,accountid,status) => {
  var membersRef = db.collection("organizations").doc(organizationname);

  membersRef.get().then(function(doc) {
      if (doc.exists){
        var prevMembers = doc.data().organizationmembers

      // console.log("PrevMembers:",prevMembers)
      prevMembers.push({
        accountid:accountid,
        emailaddress:emailaddress,
        status:status,
        department: "any",
      })

      membersRef.update({
        organizationmembers: prevMembers
      })
      }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });

}


export const addActivityToAccount = (activity, accountid) => {
  // console.log("Activity:",activity, accountid)
  var activityRef = db.collection("accounts").doc(accountid);

  activityRef.get().then(function(doc) {
      if (doc.exists){
        var prevActivity = doc.data().activity
        //
        // console.log("PrevActivity:",prevActivity)
        // console.log(activity.runbookid,activity.runbooktitle,activity.runbookstatus,activity.runbookobjectives)
        prevActivity.push({
          runbookid:activity.runbookid,
          runbooktitle:activity.runbooktitle,
          runbookobjectives: activity.runbookobjectives,
        })

        activityRef.update({
          activity: prevActivity
        })
        }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });
}

export const getAccountActivityFromOrganization =  (organizationname, accountid)  => {
  var activityRef = db.collection("organizations").doc(organizationname);
  activityRef.get().then(function(doc) {
      if (doc.exists){
        var prevActivity = doc.data().organizationactivity
        prevActivity.map((act) => {

        })
        }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });
}
export const addActivityToOrganization = (organizationname, activity) => {
  // console.log("Activity:",activity)
  var activityRef = db.collection("organizations").doc(organizationname);

  activityRef.get().then(function(doc) {
      if (doc.exists){
        var prevActivity = doc.data().organizationactivity
        //
        console.log("addActivityToOrganization PrevActivity:",prevActivity)
        // console.log(activity.runbookid,activity.runbooktitle,activity.runbookstatus,activity.runbookobjectives)
        // prevActivity.map((act,ind) => {
          // if (act.runbookid === activity.runbookid){
          //   var index = prevActivity.indexOf(ind);
          //   if (index > -1) {
          //     prevActivity.splice(index, 1);
          //     prevActivity.push({
          //       runbookid:activity.runbookid,
          //       runbooktitle:activity.runbooktitle,
          //       runbookobjectives: activity.runbookobjectives,
          //       runbooktags: activity.runbooktags,
          //     })
          //     console.log("New Org Activity",prevActivity)
          //     activityRef.update({
          //       organizationactivity: prevActivity
          //     })
          //   }
          // }

          // Need to avoid duplicates for the same runbook
            prevActivity.push({
              runbookid:activity.runbookid,
              runbooktitle:activity.runbooktitle,
              runbookobjectives: activity.runbookobjectives,
              runbooktags: activity.runbooktags,
            })
            console.log("New Org Activity",prevActivity)
            activityRef.update({
              organizationactivity: prevActivity
            })



        }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });
}

export const completeOrganizationActivityFirestore = (organizationname, activity) => {
  // console.log("Activity:",activity)
  var activityRef = db.collection("organizations").doc(organizationname);

  activityRef.get().then(function(doc) {
      if (doc.exists){
        var prevActivity = doc.data().organizationactivity
        //
        console.log("completeOrganizationActivityFirestore PrevActivity:",prevActivity)
        prevActivity.map((act,ind) => {

          if (act.runbookid === activity.runbookid){
            console.log("%c completeOrganizationActivityFirestore ",'color:blue; font-weight:bold;')
            console.log("Match",act.runbookid, activity)
            prevActivity[ind] = {
              runbookid:activity.runbookid,
              runbooktitle:activity.runbooktitle,
              runbookobjectives: activity.runbookobjectives,
              runbooktags: activity.runbooktags,
            }
            console.log("New Org Activity",prevActivity)
            activityRef.update({
              organizationactivity: prevActivity
            })
          }

        })
      }
    }).catch(function(error) {
      // console.log("Error getting document:", error);
  });
}

export const getOrganizationActivity = (organizationname) => {
    var activityRef = db.collection("organizations").doc(organizationname);
    activityRef.get().then(function(doc) {
        if (doc.exists) {
            return doc.data().organizationactivity
        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
        }
    }).catch(function(error) {
        // console.log("Error getting document:", error);
    });
}


export const getOrganizationMembers = (organizationname) => {
    var membersRef = db.collection("organizations").doc(organizationname);
    membersRef.get().then(function(doc) {
        if (doc.exists) {
            return doc.data().organizationmembers
        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
        }
    }).catch(function(error) {
        // console.log("Error getting document:", error);
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
        // console.log("Error Message:",errorCode,errorMessage);
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
        // console.log("Error Message:",errorCode,errorMessage);
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
        // console.log(errorCode,errorMessage)
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
      // console.log("Signing out!")
        return null
    }).catch(function(error) {
        // Handle Errors here.
        // console.log("Error Message:",error);
        return error
    });

// Password Reset
export const doPasswordReset = (email) =>
    auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);
