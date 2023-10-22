const authUtil = require('../utils/auth');
const db = require('../utils/connectDb');


module.exports = require('express').Router().get('/buyer/list-of-seller', async (req, res) => {
    respObj = {}
    if (req.user.userType === 'buyer') {

        try {
            const usersCollection = db.collection('users');
            const dbRes = await usersCollection.find({uType: 'seller'})
                                                .project({_id: 1, uName: 1})
                                                .toArray();
            if (dbRes) {
                respObj.sellerList = dbRes;
            } else {
                res.status(500);
                respObj.message = 'Silent status error';
            }
            respObj.message = 'work in progress';
        } catch (err) {
            console.log(err);
            res.status(500);
            respObj.message = 'Server error';
        }
    } else {
        res.status(400);
        respObj.message = 'This endpoint is for buyers only';
    }

    if (!req.usingCurrKey) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});