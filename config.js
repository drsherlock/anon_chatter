try {
  const constants = require('./constants');
} catch (ex) {
  const constants = '';
}

const environment = 'production'; // local, production

module.exports = (function() {
  if(environment === 'production') {
    return {
      PUSHER_SECRET: process.env.PUSHER_SECRET
    };
  }
  else if(environment === 'local') {
    return {
      PUSHER_SECRET: constants.PUSHER_SECRET
    };
  }
}());
