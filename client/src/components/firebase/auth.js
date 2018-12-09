import { auth, db, storage } from './firebase';
import axios from 'axios';
import { findFirst } from 'obj-traverse/lib/obj-traverse';
const keys = require('../../secrets/keys');
let backend = keys.heroku_backend_uri

// add comment - done
// reply comment - done; sorta
// delete comment
// edit comment

export const replyCommentFirestore = (postid, commentid, commentdata) => {
  console.log(postid, commentdata)
  var postRef = db.collection("posts").doc(postid);
  postRef.get().then(function (doc) {
    if (doc.exists) {
      var prevComments = doc.data().comments
      // loop through index of prevpost
      prevComments.map((post, index) => {
        let foundPost = findFirst(prevComments[index], 'replies', { id: commentid })
        let commentData = {
          id: doc.data().commentcount + 1,
          index: foundPost.index,
          parentDepth: commentdata.parentDepth,
          parentid: commentdata.parentid,
          avatar: '/cavalry.svg',
          user: commentdata.user,
          timestamp: Date.now(),
          comment: commentdata.comment,
          collapse: false,
          showCommentBox: false,
          replies: []
        }

        if (foundPost !== false) {
          if (typeof foundPost.replies === 'undefined') {
            foundPost.replies.push(commentData)
            // need to delete the original reply here
            postRef.update({
              comments: prevComments,
              commentcount: doc.data().commentcount + 1
            })
          } else {
            foundPost.replies.push(commentData)
            postRef.update({
              comments: prevComments,
              commentcount: doc.data().commentcount + 1
            })
            // this.toggleReplyCommentBox(postid)
          }
        }
        return null
      })
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
}

export const getCommentsOfPostFirestore = (postid) => {
  console.log(postid)
  var postRef = db.collection("posts").doc(postid);
  postRef.get().then(function (doc) {
    if (doc.exists) {
      var prevComments = doc.data().comments
      return prevComments
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
    return null

  });
}

export const addCommentFirestore = (postid, commentdata) => {
  console.log(postid, commentdata)
  var postRef = db.collection("posts").doc(postid);
  postRef.get().then(function (doc) {
    if (doc.exists) {
      var prevComments = doc.data().comments
      prevComments.push({
        id: doc.data().commentcount + 1,
        index: [0],
        parentDepth: [0],
        parentid: 0,
        avatar: '/cavalry.svg',
        user: commentdata.user,
        timestamp: Date.now(),
        comment: commentdata.comment,
        collapse: false,
        showCommentBox: false,
        replies: []
      })
      postRef.update({
        comments: prevComments,
        commentcount: doc.data().commentcount + 1
      })
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });

}

export const testAdd = () => {
  db.collection("black").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
  })
    .then(function (docRef) {
      // console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

export const editRunbookFirestore = (postid) => {
  let runbookRef = db.collection("aggregation")
  runbookRef.update({
    last100: db.FieldValue.arrayUnion({ author: 'charles' })
  });
  console.log(runbookRef)
}

export const starsRunbookFirestoreRealTime = () => {
  db.collection("aggregation").doc("posts").onSnapshot(function (querySnapshot) {
    var prevRunbook = []
    querySnapshot.forEach(function (doc) {
      prevRunbook.push(doc.data());
    });
  })

}

export const starRunbookFirestore = (runbookid, username, action) => {
  var aggRef = db.collection("aggregation").doc("posts")
  var postRef = db.collection("posts").doc(runbookid)

  // Adding Star in POSTS
  if (action === 1) {
    postRef.get().then(function (doc) {
      if (doc.exists) {
        var prevRunbook = doc.data()
        // If username not found in 'starred' array
        if (prevRunbook.starred.indexOf(username) <= -1) {
          prevRunbook.starred.push(username)
          postRef.update({
            starred: prevRunbook.starred,
            stars: prevRunbook.stars + 1
          })
        } else {
          // If username is in array (because of a race condition, remove all occurences and subtract stars)
          var array = prevRunbook.starred
          var count = prevRunbook.starred.indexOf(username)
          var filtered = array.filter(function (element) {
            return element !== username;
          });
          prevRunbook.starred = filtered
          prevRunbook.starred.push(username)
          prevRunbook.stars = prevRunbook.stars - count
          postRef.update({
            starred: prevRunbook.starred,
            stars: prevRunbook.stars
          })
        }
      }
    })
    // Adding Star in AGGREGATION POSTS
    aggRef.get().then(function (doc) {
      if (doc.exists) {
        var prevAggregation = doc.data()
        prevAggregation.last100.map((post, index) => {
          if (post.id === runbookid) {
            // If username not found in 'starred' array
            if (prevAggregation.last100[index].starred.indexOf(username) <= -1) {
              // Add username to 'starred' array and increment the 'stars' by +1
              prevAggregation.last100[index].starred.push(username)
              prevAggregation.last100[index].stars = prevAggregation.last100[index].stars + 1
              aggRef.update({
                last100: prevAggregation.last100
              })
            } else {
              // If username is in array (because of a race condition, remove all occurences and subtract stars)
              var array = prevAggregation.last100[index].starred
              var count = prevAggregation.last100[index].starred.indexOf(username)
              var filtered = array.filter(function (element) {
                return element !== username;
              }); // filtered contains no occurrences of hello
              prevAggregation.last100[index].starred = filtered
              prevAggregation.last100[index].starred.push(username)
              prevAggregation.last100[index].stars = prevAggregation.last100[index].stars - count
              aggRef.update({
                last100: prevAggregation.last100
              })

            }
          }
          return null
        })
      }
    })
    // Removing Star in POSTS
  } else if (action === -1) {
    postRef.get().then(function (doc) {
      if (doc.exists) {
        var prevRunbook = doc.data()
        var index = prevRunbook.starred.indexOf(username);
        // if name exists, remove name
        if (index >= 0) {
          prevRunbook.starred.splice(index, 1);
          postRef.update({
            starred: prevRunbook.starred,
            stars: prevRunbook.stars - 1
          })
        }
      }
    })
    // Removing Start in AGGREGATION POSTS
    aggRef.get().then(function (doc) {
      if (doc.exists) {
        var prevAggregation = doc.data()
        prevAggregation.last100.map((post, ind) => {
          if (post.id === runbookid) {
            var index = prevAggregation.last100[ind].starred.indexOf(username);
            if (index >= 0) {
              prevAggregation.last100[ind].starred.splice(index, 1);
              prevAggregation.last100[ind].stars = prevAggregation.last100[ind].stars - 1
              aggRef.update({
                last100: prevAggregation.last100
              })
            }
          }
          return null
        })
      }
    })
  }
}

export const addAccountActivityFirestore = (organizationname, accountid, index) => {
  var accountRef = db.collection("account").doc(accountid);
  accountRef.get().then(function (doc) {
    if (doc.exists) {
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}

export const filterPostByTag = (tagname) => {
  const postsRef = db.collection("posts");
  let foundPosts = []
  var promise = new Promise(function (resolve, reject) {
    try {
      resolve(postsRef.where("tags", "array-contains", tagname).get().then(function (filterPostResults) {
        filterPostResults.forEach(function (doc) {
          foundPosts.push(doc.data())
        });
      })
      );
    }
    catch (err) {
      console.log(err.message)
    }
  })
  return promise.then(() => {
    return foundPosts
  })
}

export const uploadImageForPost = (uploadfile, pathfilename) => {
  // Create a reference to 'posts/accountid/filename.jpg'
  var imageImagesRef = storage.child(pathfilename);
  var file = uploadfile
  var promise = new Promise(function (resolve, reject) {
    resolve(imageImagesRef.put(file).then(function (snapshot) {
      // console.log("Image uploaded!")
    })
    );
  })
  return promise.then((url) => {
    // console.log("Finished promise uploadImageForPost")
    // return getImageUrl(pathfilename)
  })
}

export const getImageUrl = (pathfilename) => {

  var imageImagesRef = storage.child(pathfilename);
  var promise = new Promise(function (resolve, reject) {
    resolve(imageImagesRef.getDownloadURL().then(function (url) {
      // console.log(url)
      return url
    })
    );
  })
  return promise.then((url) => {
    // console.log("Finished promise getImageUrl")
    return url
  })
}

export const loadOrganization = (organizationname) => {
  // console.log(organizationname)
  if (organizationname !== "") {
    const postsRef = db.collection("organizations").doc(organizationname);
    var promise = new Promise(function (resolve, reject) {
      resolve(postsRef.get().then(function (doc) {
        if (doc.exists) {
          // console.log(doc.data())
          return doc.data()
        } else {
          // doc.data() will be undefined in this case
          return []
        }
      })
      );
    })

    return promise.then((data) => {
      // console.log("Finished",data)
      return data
    })
  }

}

export const changeOrgMemberDepartmentFirestore = (organizationname, thisindex, department) => {
  var membersRef = db.collection("organizations").doc(organizationname);

  membersRef.get().then(function (doc) {
    if (doc.exists) {
      var prevMembers = doc.data().organizationmembers
      prevMembers.forEach(function (element, index, theArray) {
        if (index === thisindex) {
          theArray[index] = {
            accountid: element.accountid,
            department: department,
            emailaddress: element.emailaddress,
            status: element.status,
          }
        }
      });
      // now set firestore with new document
      membersRef.update({
        organizationmembers: prevMembers
      })

    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });

}

export const addMemberToOrganization = (organizationname, emailaddress, accountid, status) => {
  var membersRef = db.collection("organizations").doc(organizationname);

  membersRef.get().then(function (doc) {
    if (doc.exists) {
      var prevMembers = doc.data().organizationmembers

      // console.log("PrevMembers:",prevMembers)
      prevMembers.push({
        accountid: accountid,
        emailaddress: emailaddress,
        status: status,
        department: "any",
      })

      membersRef.update({
        organizationmembers: prevMembers
      })
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}


export const addActivityToAccount = (activity, accountid) => {
  var activityRef = db.collection("accounts").doc(accountid);

  activityRef.get().then(function (doc) {
    if (doc.exists) {
      var prevActivity = doc.data().activity
      prevActivity.push({
        runbookid: activity.runbookid,
        runbooktitle: activity.runbooktitle,
        runbookobjectives: activity.runbookobjectives,
      })

      activityRef.update({
        activity: prevActivity
      })
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}

export const getAccountActivityFromOrganization = (organizationname, accountid) => {
  var activityRef = db.collection("organizations").doc(organizationname);
  activityRef.get().then(function (doc) {
    if (doc.exists) {
      var prevActivity = doc.data().organizationactivity
      prevActivity.map((act) => {
        return null
      })
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}
export const addActivityToOrganization = (organizationname, activity) => {
  // console.log("Activity:",activity)
  var activityRef = db.collection("organizations").doc(organizationname);
  activityRef.get().then(function (doc) {
    if (doc.exists) {
      var prevActivity = doc.data().organizationactivity
      //
      console.log("addActivityToOrganization PrevActivity:", prevActivity)
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
        runbookid: activity.runbookid,
        runbooktitle: activity.runbooktitle,
        runbookobjectives: activity.runbookobjectives,
        runbooktags: activity.runbooktags,
      })
      console.log("New Org Activity", prevActivity)
      activityRef.update({
        organizationactivity: prevActivity
      })
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}

export const completeOrganizationActivityFirestore = (organizationname, activity) => {
  // console.log("Activity:",activity)
  var activityRef = db.collection("organizations").doc(organizationname);
  activityRef.get().then(function (doc) {
    if (doc.exists) {
      var prevActivity = doc.data().organizationactivity
      //
      console.log("completeOrganizationActivityFirestore PrevActivity:", prevActivity)
      prevActivity.map((act, ind) => {

        if (act.runbookid === activity.runbookid) {
          console.log("%c completeOrganizationActivityFirestore ", 'color:blue; font-weight:bold;')
          console.log("Match", act.runbookid, activity)
          prevActivity[ind] = {
            runbookid: activity.runbookid,
            runbooktitle: activity.runbooktitle,
            runbookobjectives: activity.runbookobjectives,
            runbooktags: activity.runbooktags,
          }
          console.log("New Org Activity", prevActivity)
          activityRef.update({
            organizationactivity: prevActivity
          })
        }
        return null
      })
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}

export const getOrganizationActivity = (organizationname) => {
  var activityRef = db.collection("organizations").doc(organizationname);
  activityRef.get().then(function (doc) {
    if (doc.exists) {
      return doc.data().organizationactivity
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
    }
  }).catch(function (error) {
    // console.log("Error getting document:", error);
  });
}


export const getOrganizationMembers = (organizationname) => {
  var membersRef = db.collection("organizations").doc(organizationname);
  membersRef.get().then(function (doc) {
    if (doc.exists) {
      return doc.data().organizationmembers
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
    }
  }).catch(function (error) {
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
  auth.createUserWithEmailAndPassword(email, password).then(() => {
    return null
  }).catch(function (error) {
    // Handle Errors here.
    // var errorCode = error.code;
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
    .then(function () {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
    })
    .catch(function (error) {
      // Some error occurred, you can inspect the code: error.code
    });

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    // var errorCode = error.code;
    var errorMessage = error.message;
    // console.log("Error Message:",errorCode,errorMessage);
    return errorMessage
  }, () => {
    //set session
    auth.setPersistence(auth.Auth.Persistence.LOCAL).then(function () {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.

    }).catch(function (error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // console.log(errorCode,errorMessage)
    });

  });

export const getJWTVerifyToken = () => {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Now verify JWT with backend
      user.getIdToken().then(function (data) {
        // console.log("Got Token:",data)
        let newdata = { token: data }
        axios.post(backend + '/api/verify', newdata);
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
  auth.signOut().then(() => {
    // console.log("Signing out!")
    return null
  }).catch(function (error) {
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