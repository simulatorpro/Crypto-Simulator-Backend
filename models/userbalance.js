const mongoose = require("mongoose");

const schema = mongoose.Schema({
  user_id:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
  symbol: String,
  crypto_amount: {type: Number, default: 0},
  crypto_holding: {type: Number, default: 0},
});

module.exports = mongoose.model("Userbalance", schema);
