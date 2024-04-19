module.exports = {
  contracts_build_directory: '../client/src/contracts',
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
  },
  mocha: {
    // Configuration for mocha tests
  },
  compilers: {
    solc: {
      version: "0.8.19", // Specify the Solidity compiler version
      settings: {
        optimizer: {
          enabled: true, // Enable the optimizer
          runs: 200      // Set the optimization runs
        },
        viaIR: true       // Enable IR-based optimization
      }
    }
  },
};
