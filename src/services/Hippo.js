const xinmods = require('xinmods');

// setup a connection object
const hippo = xinmods.connectTo('http://localhost:8080', 'admin', 'admin');

/**
 * @type {HippoConnection}
 */
module.exports = hippo;
