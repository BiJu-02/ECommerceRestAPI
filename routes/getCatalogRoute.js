


module.exports = require('express').Router().get('/buyer/get-catalog/:seller_id', (req, res) => {
    respObj = {}

    if (!req.usingCurrToken) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});