const crypto = require('crypto');
const { TOKEN_SECRET } = require('../config/env');

module.exports = (token) => {
  return crypto
    .createHmac('sha256', TOKEN_SECRET) 
    .update(token)
    .digest('hex');
};
