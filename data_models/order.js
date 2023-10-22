

module.exports = class Order {
    constructor(buyerId, sellerId, productList) {
        this.oBuyerId = buyerId;
        this.oSellerId = sellerId;
        this.oProductList = productList;
    }
};