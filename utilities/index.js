const firestoreService = require('firestore-export-import');
const jsonfile = require('jsonfile');

if  ( process.env.NODE_ENV === 'orig'){
  const serviceAccount = require('./firestore_orig.json');
  if (process.env.NODE_ACTION === 'backup'){
    var file = './firestore_orig_data.json'
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app.firebaseio.com');
    // Start exporting your data
    firestoreService
      .backups()
      .then(data => {
          // console.log(JSON.stringify(data))
          var obj = data
          jsonfile.writeFile(file, obj, function (err) {
            console.error(err)
          })
        }
      )
  }
  if (process.env.NODE_ACTION === 'restore'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_orig_data.json');
  }
  if (process.env.NODE_ACTION === 'migrate' && process.env.NODE_SOURCE === 'prod'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_prod_data.json');
  }
}

if  ( process.env.NODE_ENV === 'dev'){
  const serviceAccount = require('./firestore_dev.json');
  if  ( process.env.NODE_ACTION === 'backup'){
    var file = './firestore_dev_data.json'
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-dev.firebaseio.com');
    // Start exporting your data
    firestoreService
      .backups()
      .then(data => {
          // console.log(JSON.stringify(data))
          var obj = data
          jsonfile.writeFile(file, obj, function (err) {
            console.error(err)
          })
        }
      )
  }
  if (process.env.NODE_ACTION === 'restore'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-dev.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_dev_data.json');
  }
  if (process.env.NODE_ACTION === 'migrate' && process.env.NODE_SOURCE === 'orig'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-dev.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_orig_data.json');
  }
  if (process.env.NODE_ACTION === 'migrate' && process.env.NODE_SOURCE === 'prod'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-dev.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_prod_data.json');
  }
}

if  ( process.env.NODE_ENV === 'prod'){
  const serviceAccount = require('./firestore_prod.json');
  if  ( process.env.NODE_ACTION === 'backup'){
    var file = './firestore_prod_data.json'
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-prod.firebaseio.com');
    // Start exporting your data
    firestoreService
      .backups()
      .then(data => {
          // console.log(JSON.stringify(data))
          var obj = data
          jsonfile.writeFile(file, obj, function (err) {
            console.error(err)
          })
        }
      )
  }
  if (process.env.NODE_ACTION === 'restore'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-prod.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_prod_data.json');
  }
  if (process.env.NODE_ACTION === 'migrate' && process.env.NODE_SOURCE === 'orig'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-prod.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_orig_data.json');
  }
  if (process.env.NODE_ACTION === 'migrate' && process.env.NODE_SOURCE === 'dev'){
    // Initiate Firebase App
    firestoreService.initializeApp(serviceAccount, 'https://cavalry-app-prod.firebaseio.com');
    // Start importing your data
    // The array of date fields is optional
    firestoreService.restore('./firestore_dev_data.json');
  }
}

if  ( process.env.NODE_ENV === 'orig'){
  const serviceAccount = require('./firestore_orig.json');
  if (process.env.NODE_ACTION === 'delete'){

  }
}
