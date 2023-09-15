const TradingViewAPI = require("tradingview-scraper");
const OrderService = require("../service/order");
const RoundService = require("../service/round");
const CryptoService = require("../service/crypto");
const TermresultService = require("../service/termresult");
const UserService = require("../service/user");
const SettingService = require("../service/setting");
const NotificationService = require("../service/notification");
const config = require("../config");
const mathFuns = require("../helpers/math");
const round = require("../models/round");

const tv = new TradingViewAPI.TradingViewAPI();


const updatePrice = (io) => {
    let cryptoFeeds = config.CryptoConfig.map(el => (
        {
            symbol: el,
            oldPrice: 0,
            currentPrice: 0,
            init: false
        }
    ))
    console.log(cryptoFeeds)
    tv.setup().then(() => {
        cryptoFeeds.map(el => {
            tv.getTicker(el.symbol).then(ticker => {
                ticker.on('update', data => {
                    // console.log(el.symbol, data);
                    if (data.lp && data.lp != el.currentPrice) {

                        updateCryptoPrice(el.symbol, data, el.init);

                        if(!el.init){
                            el.oldPrice = data.lp;
                            el.currentPrice = data.lp;
                            el.init = true;
                        } else {
                            el.oldPrice = el.currentPrice;
                            el.currentPrice = data.lp;
                            
                            io.emit("updatePrice", {symbol: el.symbol, price: data.lp, ch: data.ch, chp: data.chp});
                            orderCheckBot(el.symbol, el.oldPrice, el.newPrice, io);
                        }
                    }
                })
            })
        })
    }).catch(error => console.log(error));
  }

  const updateCryptoPrice = async (symbol, data, init) => {
    const cryptoDetail = await CryptoService.getCryptoBy({symbol: symbol});
    if(!cryptoDetail && !init){
         CryptoService.addCrypto({name: symbol, symbol: symbol, price: data.lp, ch: data.ch, chp: data.chp});
    }
    if(cryptoDetail)
         CryptoService.updateCrypto(symbol, {price: data.lp, ch: data.ch, chp: data.chp});
  }

  const orderCheckBot = async (symbol, oldPrice, newPrice, io) => {
    try {
        let {min, max} = mathFuns.sortTwoNums(newPrice, oldPrice);
        const pendingEligibleOrders = await OrderService.getOrderBy({symbol: symbol, status: "pending", order_mode: "limit", price: {$gte: min, $lte: max}});
        pendingEligibleOrders.map(async (el) => {
            await OrderService.confirmOrder(el._id);
            let userDetail = await UserService.releaseHolding(el.order_owner, symbol, el.order_type, el.amount, el.price);
            if(userDetail)
                io.to(userDetail.socket_id).emit("order", "order updated!");
        })
    } catch (error) {
        console.log(error);
    }

}

const roundCheckBot = async (io) => {
    // try {
    //     const lastRound = await RoundService.getCurrentRound();
    //     const currentRound = await RoundService.makeRound({duration: 3600 * 1, created: Date.now()});
    //     io.emit("updateRound", currentRound);

    //     if(!lastRound)
    //         return;


    //     const allUsers = await UserService.getUsersBy({is_winner: false, signed: true});
    //     let roundResult = [];
    //     for(let i=0; i< allUsers.length; i++){
    //         const nowAmount = allUsers[i].usd_balance + allUsers[i].usd_holding + allUsers[i].eth_balance * eth_price_current + allUsers[i].eth_holding * eth_price_current;
    //         let termresult = await TermresultService.getTermresultBy({
    //             round_id: lastRound._id, owner_id: allUsers[i]._id, status: "pending"
    //         });
    //         if(termresult){
    //             TermresultService.updateTermresult(
    //                 {
    //                     _id: termresult._id
    //                 }, {
    //                     current_amount: nowAmount,
    //                     lost_amount: termresult.old_amount - nowAmount,
    //                     status: "ended"
    //             });
                
    //             roundResult.push({
    //                 user_id: allUsers[i]._id,
    //                 result_id: termresult._id,
    //                 user_wallet: allUsers[i].walletAddress,
    //                 lost_amount: termresult.old_amount - nowAmount
    //             })
                
    //         }
    //     }

    //    /////////////////check winners///////////////////////
    //     if(roundResult.length <= 0)
    //         return;

    //     const {roundDuration, winnerAmount} = await SettingService.getSettingInfo();
    //     roundResult.sort(function(a,b){return a.lost_amount - b.lost_amount});
    //     roundResult.reverse();
    //     console.log(roundResult);
    //     RoundService.updateRound(lastRound._id, {winners: roundResult.slice(0, winnerAmount)});
    //     for(let i =0; i< winnerAmount; i++){
    //         await UserService.updateUser(roundResult[i].user_id, { is_winner: true});
    //         NotificationService.addNotification({owner_id: roundResult[i].user_id, message: `Congratulation Winner! You are ${i + 1}th Winner in this week`})
    //     }

    //     ///////////////make new termresults////////////////////
    //     const loosers = await UserService.getUsersBy({is_winner: false, signed: true});
    //     loosers.map((el) => {
    //         const currentLooserMark = el.usd_balance + el.usd_holding + el.eth_balance * eth_price_current + el.eth_holding * eth_price_current;
    //         TermresultService.makeTermresult({
    //             round_id: currentRound._id,
    //             owner_id: el._id,
    //             old_amount: currentLooserMark,
    //             current_amount: currentLooserMark,
    //         })
    //     })
        
    // } catch (error) {
    //     console.log(error);
    // }
}

// const checkWinners = async (roundDetail) => {
//     if(!roundDetail)
//         return;
//     const termResultsByUser = await TermresultService.getTermresultsBy({round_id: roundDetail._id});
//     console.log(termResultsByUser);
//     if(termResultsByUser.length <= 0)
//         return;
//     const {roundDuration, winnerAmount} = await SettingService.getSettingInfo();
//     const winners = await termResultsByUser.map((el, idx) => {
//         if(idx < winnerAmount)
//             return el._id;
//     });
//     await RoundService.updateRound(roundDetail._id, {winners});
//     winners.map((el, idx) => {
//         const userID = termResultsByUser[idx].owner_id;
//         UserService.updateUser(userID, {
//             is_winner: true
//         })
//         NotificationService.addNotification({owner_id: userID, message: `Congratulation Winner! You are ${idx + 1}th Winner in this week`})
//     })
// }
module.exports = {
    updatePrice,
    orderCheckBot,
    roundCheckBot
}