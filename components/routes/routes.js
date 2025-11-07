const networkPromotionPost = require('./networkPromotionPost');
const networkPromotionGet = require('./networkPromotionGet');

const routes = function(server){
    server.use('/postPromotion',networkPromotionPost);
    server.use('/listPromotion',networkPromotionGet);
}

module.exports = routes;