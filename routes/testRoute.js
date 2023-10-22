const authUtil = require('../utils/auth');

module.exports = require('express').Router().get('/buyer/test', (req, res) => {
    const respObj = {}
    if (!req.usingCurrKey) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    respObj.message = `${authUtil.currSecretKey}, ${authUtil.prevSecretKey}`;
    res.send(respObj);
});