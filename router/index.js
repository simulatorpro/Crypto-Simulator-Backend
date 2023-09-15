const express = require("express");
const router = express.Router();
require('./user')(router);
require('./order')(router);
require('./crypto')(router);
require('./notification')(router);
require('./termresult')(router);
require('./leaderboard')(router);

module.exports = router;
