const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const genRand = () => { return crypto.randomBytes(32).toString('hex'); }


let currSecretKey = genRand();
let prevSecretKey = genRand();

const genHash = (data) => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

const rotateKeys = () => {
    prevSecretKey = currSecretKey;
    currSecretKey = genRand();
    console.log('curr key changed to: ', currSecretKey);
}

const genToken = (userName, userType) => {
    return jwt.sign({userName, userType}, currSecretKey, {expiresIn: '3h'});
}

const authToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        res.status(400).send({message: 'Unauthorized'});
    }
    jwt.verify(token, currSecretKey, (err, user) => {
        if (err) {
            jwt.verify(token, prevSecretKey, (errPrev, userPrev) => {
                if (errPrev) {
                    res.status(400).send({message: 'Forbidden'});
                } else {
                    req.user = userPrev;
                    req.usingCurrKey = false;
                    next();
                }
            })
        } else {
            req.user = user;
            req.usingCurrKey = true;
            next();
        }
    })
}

module.exports = {
    currSecretKey,
    prevSecretKey,
    genHash,
    rotateKeys,
    genToken,
    authToken
}