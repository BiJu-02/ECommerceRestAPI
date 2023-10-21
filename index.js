const cors = require('cors');
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const authenticate = require('./utils/auth');
app.use(['/api/buyer', '/api/seller'], )

// routes directory contains all js files which export express routers
const routeDir = path.join(__dirname, 'routes');    
const routeFiles = fs.readdirSync(routeDir);

// iterating through all the files in routes directory and adding the express routers to app
routeFiles.forEach((file) => {
    if (file.endsWith('.js')) {
        const route = require(path.join(routeDir, file));
        if (route instanceof express.Router) {
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
    
    app.listen(process.env.PORT, (err) => {             // server up online
        if (err) { console.error(err); }
        else { console.log(`Sever running on port: ${process.env.PORT}`); }
    });

})();