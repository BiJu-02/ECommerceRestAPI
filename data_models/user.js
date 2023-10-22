

module.exports =  class User {
    constructor(usrname, pass, typ) {
        this.uName = usrname;
        this.uPassHash = pass;
        this.uType = typ;
    }
};