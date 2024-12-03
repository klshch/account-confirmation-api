const crypto = require('crypto');
const { TOKEN_SECRET } = require('../config/env'); 

module.exports = () => {
  return crypto.randomBytes(20).toString('hex'); 
};
