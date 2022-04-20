const orderBook = artifacts.require("orderBook");

module.exports = function(deployer) {
    
    
  deployer.deploy(orderBook);
};
