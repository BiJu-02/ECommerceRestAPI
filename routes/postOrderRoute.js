const authUtil = require('../utils/auth');
const db = require('../utils/connectDb');
const Order = require('../data_models/order');
const { ObjectId } = require('mongodb');

const validCreateOrderParam = (req) => {
    let flag =  req.user.userType === 'buyer' &&
        ObjectId.isValid(req.params['seller_id']) &&
        Array.isArray(req.body.productList) && 
        req.body.productList.every((product) => {
            return typeof(product) === 'string';
        });
    return flag;
}

module.exports = require('express').Router().post('/buyer/create-order/:seller_id', async (req, res) => {
    const respObj = {};
    if (validCreateOrderParam(req)) {
        // if catalog with sellerId exists and also check if all the products in productList exist within it
        try {
            const usersCollection = db.collection('users');
            const ordersCollection = db.collection('orders');
            const catalogsCollection = db.collection('catalogs');
            const dbRes1 = await usersCollection.findOne({uName: req.user.userName});
            if (dbRes1) {
                const dbRes2 = await catalogsCollection.findOne({cSellerId: req.params['seller_id']});
                if (dbRes2) {
                    if (req.body.productList.every((item) => {
                        return dbRes2.cProductList.some((dbItem) => {
                            return dbItem.name === item;
                        }) 
                    })) {
                        const dbRes3 = await ordersCollection.insertOne(
                            new Order(dbRes1._id.toString(), req.params['seller_id'], req.body.productList)
                        );
                        if (dbRes3.acknowledged) {
                            respObj.message = 'New order added successfully';
                        } else {
                            res.status(500);
                            respObj.message = 'Silent server error';
                        }
                    } else {
                        res.status(400);
                        respObj.message = 'Some products listed are not available in this seller\'s catalog';
                    }

                } else {
                    res.status(400);
                    respObj.message = 'Catalog with provided seller Id does not exist';
                }

            } else {
                res.status(500);
                respObj.message = 'Silent server error';
            }
        } catch (err) {
            res.status(500);
            respObj.message = 'Server error';
        }
    } else {
        res.status(400);
        respObj.message = 'Invalid parameters/user';
    }
    if (!req.usingCurrToken) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});