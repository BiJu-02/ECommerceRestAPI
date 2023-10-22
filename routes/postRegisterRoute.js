const authUtil = require('../utils/auth');
const db = require('../utils/connectDb');
const User = require('../data_models/user');

const validRegisterParam = (req) => {     // validation for existence of those parameters and their type
    return typeof(req.body.userName) === 'string'  &&
        typeof(req.body.password) === 'string'  &&
        typeof(req.body.userType) === 'string'  &&
        (req.body.userType === 'buyer' || req.body.userType === 'seller')
}

module.exports = require('express').Router().post('/auth/register', async (req, res) => {
    const respObj = {};
    if (validRegisterParam(req)) {
        try {
            const usersCollection = db.collection('users');
            let dbRes = await usersCollection.findOne({uName: req.body.userName});
            if (dbRes) {    // username already exists
                res.status(400);
                respObj.message = `A ${dbRes.uType} account already exists with this username`;
            } else {
                const passHash = authUtil.genHash(req.body.password);     // hashing the password
                dbRes = await usersCollection.insertOne(new User(req.body.userName, passHash, req.body.userType));
                if (dbRes.acknowledged) {
                    respObj.message = 'User registered successfully';
                } else {
                    res.status(500);
                    respObj.message = 'Silent server error';
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500);
            respObj.message = 'Server error';
        }
    } else {
        res.status(400);
        respObj.message = 'Invalid parameters';
    }
    res.send(respObj);
});