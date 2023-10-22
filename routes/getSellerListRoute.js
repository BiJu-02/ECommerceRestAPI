


module.exports = require('express').Router().get('/buyer/list-of-seller', (req, res) => {
    respObj = {}

    if (!req.usingCurrToken) {
        respObj.newToken = authUtil.genToken(req.user.userName, req.user.userType);
    }
    res.send(respObj);
});