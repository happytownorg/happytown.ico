module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    test: {
      host: "localhost",
      port: 8545,
      network_id: "8"
    },
    live_main: {
      host: "localhost",
      port: 8545,
      network_id: "1",
      from: "0x04818026C13251270BF386b2C4B27E2B5999C5A1"
    },
    live_slave: {
      host: "192.168.1.5",
      port: 8545,
      network_id: "1",
      from: "0x04818026C13251270BF386b2C4B27E2B5999C5A1"
    },
    rinkeby: {
      host: "192.168.1.5",
      port: 8546,
      network_id: "4",
      from: "0x5E0039d104468Ff8f94cCf6a9F0817B696eC0fc9"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
