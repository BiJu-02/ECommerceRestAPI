const cors = require('cors');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const authUtil = require('./utils/auth');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(['/api/buyer', '/api/seller'], authUtil.authToken);

// routes directory contains all js files which export express routers
const routeDir = path.join(__dirname, 'routes');    
const routeFiles = fs.readdirSync(routeDir);

// iterating through all the files in routes directory and adding the express routers to app
routeFiles.forEach((file) => {
    if (file.endsWith('.js')) {
        const route = require(path.join(routeDir, file));
        if (typeof(route) === typeof(express.Router())) {
            app.use('/api', route);
        } else {
            console.log(`skipping ${file}, it is not an express router`);
        }
    }
});

// immediate invoke is used because database connection has to be setup before the api comes online
// the functions required for those are async
(async () => {

    await require('./utils/initDb.js')();     // database setup

    // rotate twice since both curr and prev secret keys were empty.
    console.log(authUtil.currSecretKey, authUtil.prevSecretKey);
    // setTimeout(authUtil.rotateKeys, 2 * 60 * 60 * 1000);       // rotate every 2 hrs
    setInterval(authUtil.rotateKeys, 30 * 1000);       // rotate every 2 hrs

    app.listen(process.env.PORT, (err) => {             // server up online
        if (err) { console.error(err); }
        else { console.log(`Sever running on port: ${process.env.PORT}`); }
    });

})();