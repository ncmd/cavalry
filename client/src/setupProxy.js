const proxy = require('http-proxy-middleware');

// Credentials to return
if (process.env.NODE_ENV === 'production'){
  module.exports = function(app) {
    app.use(proxy('/api', { target: 'https://cavalry-app-prod.herokuapp.com' }));
  };

} else if (process.env.REACT_APP_HOST_ENV === 'local'){
  module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:8000' }));
  };

} else {
  module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:8000' }));
  };
}
