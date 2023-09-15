const CryptoService = require("../service/crypto");
const config = require("../config");

const getCryptosPrice = async (req, res) => {
  const cryptos = await CryptoService.getAllCryptos();
  if(cryptos)
    return res.send({status: true, data: cryptos});
  return res.send({status: false, message: "No crypto info saved!"})
}


module.exports = {
  getCryptosPrice
}