const UserController = require("../controller/user");
const authMiddleware = require("../middleware/auth");
const winnerAuthMiddleware = require("../middleware/winnerAuth");


module.exports = (router) => {
  router.get("/users", UserController.getAllUsers);

  router.post("/users/loginwithwallet", UserController.loginWithWallet);

  router.post("/users/authwithdiscord", UserController.authWithDiscord);
  
  router.post("/users/loginwithdiscord", UserController.loginWithDiscord);

  router.post("/users/authwithtwitter", UserController.authWithTitter);
  
  router.post("/users/loginwithtwitter", UserController.loginWithTwitter);

  router.get("/users/userid/:id", UserController.getUserById);

  router.get("/users/walletaddress/:walletaddress", UserController.getUserByWallet);

  router.patch("/users/", authMiddleware.auth, UserController.updateUser);

  router.patch("/users/reset", authMiddleware.auth, winnerAuthMiddleware.winnerAuth, UserController.resetUser);

  router.delete("/users/:id", authMiddleware.auth, UserController.deleteUser);
}

