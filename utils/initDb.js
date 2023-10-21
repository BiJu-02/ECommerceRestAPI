
const dbInfo = require('./dbInfo');
const db = require('./connectDb');

module.exports = async () => {
    try {
        const collectionList = await db.listCollections().toArray();
        const promiseArr = [];
        dbInfo.collectionNames.forEach((requiredColName) => {
            let exists = false;
            for (const col of collectionList) {
                if (col.name == requiredColName) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                promiseArr.push(db.createCollection(requiredColName));
            }
        });
        await Promise.all(promiseArr);
        
    } catch (err) {
        console.log(err);
    }
};