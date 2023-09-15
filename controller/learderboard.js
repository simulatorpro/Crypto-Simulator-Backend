const OrderService = require("../service/order");
const UserService = require("../service/user");

const getAll = async (req, res) => {
  try {
    let result = [];
    const users = await UserService.getAllUsers();

    for(let i=0; i < users.length; i++){
      let ordersByUser = await OrderService.getOrderByUserId(users[i]._id);
      let tradeAmount = 0;
      ordersByUser.map(el => {
        tradeAmount += el.amount * el.price;
      })
  
      result.push({
        userID: users[i]._id,
        userName: users[i].userName,
        userWallet: users[i].walletAddress,
        userAvatar: users[i].userAvatar,
        totalTradesAmount: tradeAmount,
        totalTradesCount: ordersByUser.length
      })
    }
  
    return res.send({status: true, data: result})

  } catch (error) {
    return res.send({status: false, message: "something went wrong!"})
  }
 
}
module.exports = {
  getAll,
}