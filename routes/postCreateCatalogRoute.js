const authUtil = require('../utils/auth');
const db = require('../utils/connectDb');

const validCreateCatalogParam = (req) => {
    const expectedKeys = ['name', 'price'];
    let flag = req.user.userType === 'seller' &&     // this comes from auth.js authToken() middleware
    Array.isArray(req.body.productList) &&
    req.body.productList.length === new Set(req.body.productList.map(product => product.name)).size &&
    req.body.productList.every((product) => {
        const productKeys = Object.keys(product);
            return expectedKeys.length === productKeys.length &&
                typeof(product['name']) === 'string' && 
                typeof(product['price']) == 'number' &&
                expectedKeys.every((key) => {
                    return productKeys.includes(key)
                });
    })
    return flag;
}

module.exports = require('express').Router().post('/seller/create-catalog', async (req, res) => {
    const respObj = {};
    if (validCreateCatalogParam(req)) {
        // check if catalog already exists for seller...if it exists update it.
        try {
            const usersCollection = db.collection('users');
            const catalogsCollection = db.collection('catalogs');
            const dbRes = await usersCollection.findOne({uName: req.user.userName});
            if (dbRes) {            // seller exists...well we already kindof know that...but we need sellerId (doc objectId _id)
                const dbRes2 = await catalogsCollection.updateOne(
                    {cSellerId: dbRes._id.toString()},
                    {
                        $set : {
                            cProductList: req.body.productList
                        }
                    },
                    {upsert: true}
                );
                if (dbRes2.acknowledged) {
                    if (dbRes2.upsertedId) { respObj.message = 'Catalog update successfully' }
                    else { respObj.message = 'Catalog created successfully'; }
                } else {
                    res.status(500);
                    respObj.message = 'Silent server error';
                }
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
        respObj.message = 'Invalid parameters/user';
    }
    if (!req.usingCurrKey) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});