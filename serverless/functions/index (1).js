const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// // Algolia
const algoliasearch = require('algoliasearch');
// const algoliaFunctions = require('algolia-firebase-functions');
// const algolia = algoliasearch(functions.config().algolia.app,functions.config().algolia.key);
// const index = algolia.initIndex(functions.config().algolia.index);

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'posts';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);


// Update the search index every time a blog post is written.
exports.onPostCreated = functions.firestore.document('posts/{postId}').onCreate((snap, context) => {
  // Get the post document
  const post = snap.data();

  // Add an 'objectID' field which Algolia requires
  post.objectID = context.params.postId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.addObject(post);
});

// // Algolia Sync with Firebase
// exports.syncAlgoliaWithFirebase = functions.database.ref('/posts/{postId}').onWrite(async (change, context) => {
//     await algoliaFunctions.syncAlgoliaWithFirebase(index, change)
// });



// when a document 'post/id' is created
exports.aggregate = functions.firestore.document('posts/{postId}').onCreate(async (snapshot,context) => {

        // post = all of snapshot data
        const post = snapshot.data();

        // aggregate variable = aggregation/posts document
        const aggRef = db.doc('aggregation/posts');

        // wait for response of aggRef data
        const aggDoc = await aggRef.get();

        // set this variable to = the 'data' of aggDoc json response
        const aggData = aggDoc.data();

        // Aggregate New Data
        const next = {
            count: aggData.count + 1,
            last10: [post, ...aggData.last10.slice(0, 9)]
        };
        return aggRef.set(next);
    });


// When a user is created, create an aggregate list for Backend to Hold, so frontend can check if user exists with 1 q


// When post is submitted aggretage tag list


// Aggregate list of subscribers to be viewed in dashboard
