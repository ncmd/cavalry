const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const https = require('https');

exports.redirectHeroku = functions.https.onRequest((req, res) => {
  res.send()
  res.end()
  new Promise((resolve, reject) => {
       const hostname = functions.config().heroku.backend_prod;
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


// when a document 'post/id' is created
exports.aggregate100Posts = functions.firestore.document('posts/{postId}').onCreate(async (snapshot,context) => {
        // post = all of snapshot data
        const post = snapshot.data();

        // aggregate variable = aggregation/posts document
        const aggRef = db.doc('aggregation/posts');

        // wait for response of aggRef data
        const aggDoc = await aggRef.get();

        // set this variable to = the 'data' of aggDoc json response
        const aggData = aggDoc.data();
        //
        // console.log("post",post)
        // const obj = post
        // obj.postid = obj.post
        // delete obj.post
        // console.log("obj",obj)
        // console.log("postid",post.id)
        // console.log("aggData",...aggData)
        // // Aggregate New Data
        // const next = {
        //     last100: {post,aggData},
        // };
        // console.log("next",next)
        // return aggRef.set(next);

        // Aggregate New Data
        const next = {
            count: aggData.count + 1,
            last100: [post, ...aggData.last100.slice(0, 99)]
        };
        return aggRef.set(next);
});




// when a document 'post/id' is created
exports.aggregate100Requests = functions.firestore.document('requests/{requestId}').onCreate(async (snapshot,context) => {
        // post = all of snapshot data
        const request = snapshot.data();

        // aggregate variable = aggregation/posts document
        const aggRef = db.doc('aggregation/requests');

        // wait for response of aggRef data
        const aggDoc = await aggRef.get();

        // set this variable to = the 'data' of aggDoc json response
        const aggData = aggDoc.data();

        // Aggregate New Data
        const next = {
            count: aggData.count + 1,
            last100: [request, ...aggData.last100.slice(0, 99)]
        };
        return aggRef.set(next);
    });
