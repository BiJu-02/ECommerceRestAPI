module.exports = class User {
    constructor(uname, pass, typ) {
        this.uName = uname;
        this.uPassHash = pass;
        this.uType = typ;
    }
};