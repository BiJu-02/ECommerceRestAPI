const { ObjectId } = require('mongodb');
const authUtil = require('../utils/auth');
const db = require('../utils/connectDb');

const validGetCatalogParam = (req) => {
    return req.user.userType === 'buyer' &&
        ObjectId.isValid(req.params['seller_id']);
}

module.exports = require('express').Router().get('/buyer/seller-catalog/:seller_id', async (req, res) => {
    respObj = {}
    if (validGetCatalogParam(req)) {
        const catalogsCollection = db.collection('catalogs');
        const dbRes = await catalogsCollection.findOne({cSellerId: req.params['seller_id']});
        if (dbRes) {
            respObj.catalog = dbRes;
        } else {
            res.status(400);
            respObj = 'There is no catalog with belonging to seller with this Id';
        }
    } else {
        res.status(400);
        respObj.message = 'Invalid user or parameters';
    }

    if (!req.usingCurrToken) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});