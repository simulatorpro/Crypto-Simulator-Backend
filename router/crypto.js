const CryptoController = require("../controller/crypto");

module.exports = (router) => {
  router.get("/cryptocurrencies", CryptoController.getCryptosPrice);
}

