const OrderController = require("../controller/order");
const authMiddleware = require("../middleware/auth");
const winnerAuthMiddleware = require("../middleware/winnerAuth");

module.exports = (router) => {
  router.get("/orders", OrderController.getAllOrders);

  router.post("/order/makeorder", authMiddleware.auth, winnerAuthMiddleware.winnerAuth, OrderController.makeOrder);

  router.post("/order/cancelorder", authMiddleware.auth, OrderController.cancelOrder);

  router.get("/order/:id", OrderController.getOrderById);

  router.get("/orders/walletaddress/:walletaddress", OrderController.getOrderByUserWallet);
  
  router.get("/orders/userid/:userid", OrderController.getOrderByUserId);

  router.post("/order/makemarket", authMiddleware.auth, winnerAuthMiddleware.winnerAuth, OrderController.makeMarket);



}

