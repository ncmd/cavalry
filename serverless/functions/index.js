const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();


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
