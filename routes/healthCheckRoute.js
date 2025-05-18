module.exports = require('express').Router().get('/health', (req, res) => {
    res.status(200).send({ status: 'healthy' });
});