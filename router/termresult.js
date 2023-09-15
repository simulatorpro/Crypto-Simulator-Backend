const TermresultController = require("../controller/termresult");

module.exports = (router) => {
  router.get("/roundresult/current", TermresultController.getCurrentWeekResult);

  router.get("/roundresult/last", TermresultController.getLastWeekResult);

  router.get("/roundresult/top", TermresultController.getTopResult);


}

