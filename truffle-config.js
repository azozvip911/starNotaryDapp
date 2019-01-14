// Allows us to use ES6 in our migrations and tests.
require('babel-register')
const HDWalletProvider = require("truffle-hdwallet-provider");

// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545, //7545
      network_id: '*' // Match any network id
    },
    ganache:{
      host: '127.0.0.1',
      port: 7545, //7545
      network_id: '*' // Match any network id

    },
    rinkeby: {
      provider: new HDWalletProvider("trap behind hurry maid detail rail library impose word night exist ceiling","https://rinkeby.infura.io/v3/f44d8340fb9a4a409feca7f0cd96bf90",2)
        ,
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000
    }

  }
}
