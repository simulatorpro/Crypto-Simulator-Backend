const NotificationController = require("../controller/notification");

module.exports = (router) => {

  router.get("/notification/checked/:id", NotificationController.updateNotification);

}

