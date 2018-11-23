
// Credentials to return
if (process.env.NODE_ENV === 'production'){
    // return prod keys
    // console.log("Environment:",process.env.NODE_ENV)
    // module.exports = require('./keys_prod');
    module.exports = require('./keys_prod')
} else if (process.env.REACT_APP_HOST_ENV === 'local'){
    // return prod keys
    console.log("Environment: local")
    module.exports = require('./keys_local');
} else {
    // return dev keys
    console.log("Environment:",process.env.NODE_ENV)
    module.exports = require('./keys_dev')
}
