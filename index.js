const cors = require('cors');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const authUtil = require('./utils/auth');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(['/api/buyer', '/api/seller'], authUtil.authToken);

// routes directory contains all js files which export express routers
const routeDir = path.join(__dirname, 'routes');    
const routeFiles = fs.readdirSync(routeDir);

// iterating through all the files in routes directory and adding the express routers to app
routeFiles.forEach((file) => {
    if (file.endsWith('Route.js')) {
        app.use('/api', require(path.join(routeDir, file)));
    }
});

// immediate invoke is used because database connection has to be setup before the api comes online
// the functions required for those are async
(async () => {

    await require('./utils/initDb.js')();                       // database setup

    setInterval(authUtil.rotateKeys, 2 * 60 * 60 * 1000);       // rotate every 2 hrs

    app.listen(process.env.PORT, (err) => {                     // server up online
        if (err) { console.error(err); }
        else { console.log(`Sever running on port: ${process.env.PORT}`); }
    });

})();