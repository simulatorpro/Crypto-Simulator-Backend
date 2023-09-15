const LeaderboardController = require("../controller/learderboard");

module.exports = (router) => {
  router.get("/leaderboard/all", LeaderboardController.getAll);
}

