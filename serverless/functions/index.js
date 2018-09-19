const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();



const https = require('https');

exports.redirectHeroku = functions.https.onRequest((req, res) => {
  res.send()
  res.end()
  new Promise((resolve, reject) => {
       const hostname = functions.config().heroku_backend_prod;
       const pathname = req.url;
       let data = '';
       const request = https.get(`https://${hostname}${pathname}`, (ress) => {
           ress.on('data', (d) => {
               data += d;
           });
           ress.on('end', resolve);
       });
       request.on('error', reject);
   });
});

// Update the search index every time a blog post is written.
exports.onPostWrite = functions.firestore.document('posts/{postId}').onWrite(async (snapshot, context) => {

  const algoliasearch = require('algoliasearch');
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const ALGOLIA_SEARCH_KEY = "posts"
  const ALGOLIA_INDEX_NAME_POSTS = 'posts';
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

  // Get the post document
  const post = snapshot.after.data();
  console.log("Snapshot Data:",post)

  // Add an 'objectID' field which Algolia requires
  post.objectID = context.params.postId;
  console.log("Post Object Id:",post.objectID)

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME_POSTS);

  await index.saveObject(post);

  return null
});

// Update the search index every time a blog post is written.
exports.onRequestWrite = functions.firestore.document('requests/{requestId}').onWrite(async (snapshot, context) => {

  const algoliasearch = require('algoliasearch');
  const ALGOLIA_ID = functions.config().algolia.app_id;
  const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
  const ALGOLIA_SEARCH_KEY = "requests"
  const ALGOLIA_INDEX_NAME_REQUESTS = 'requests';
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);


  // Get the post document
  const request = snapshot.after.data();
  console.log("Snapshot Data:",request)

  // Add an 'objectID' field which Algolia requires
  request.objectID = context.params.requestId;
  console.log("Request Object Id:",request.objectID)

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME_REQUESTS);

  await index.saveObject(request);

  return null
});
