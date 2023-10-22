const authUtil = require('../utils/auth');
const db = require('../utils/connectDb');


module.exports = require('express').Router().get('/seller/orders', async (req, res) => {
    respObj = {}
    if (req.user.userType === 'seller') {
        try {
            const ordersCollection = db.collection('orders');
        const usersCollection = db.collection('users');
        const dbRes1 = await usersCollection.findOne({uName: req.user.userName});
        if (dbRes1) {
            const dbRes2 = await ordersCollection.find({oSellerId: dbRes1._id.toString()})
                                                    .project({_id: 0, oBuyerId: 1, oProductList: 1})
                                                    .toArray();
            respObj.ordersList = dbRes2;
        } else {
            res.status(500);
            respObj.message = 'Silent server error';
        }
        } catch (err) {
            console.log(err);
            res.status(500);
            respObj.message = 'Server error';
        }
    } else {
        res.status(400);
        respObj.message = 'This endpoint is for sellers only';
    }
    if (!req.usingCurrKey) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});