

module.exports = require('express').Router.get('/test', (req, res) => {
    res.send({message: 'works'});
})