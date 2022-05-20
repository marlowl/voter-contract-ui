## Voter contract UI

### Introduction
Starter dApp for an account based voting mechanism. The template can be a start for developers who want to try out an ink! smart contract in combination with a simple user interface.

### Demo video


https://user-images.githubusercontent.com/30845815/169352588-db04d5a8-84fc-4ac5-95e8-5a85a02fe7b4.mp4


### Project requirements
-  Follow the Substrate [getting started](https://docs.substrate.io/v3/getting-started/installation/) tutorial to prepare your envrionment for Substrate development

- Follow the steps provided in the Substrate [contracts node template](https://github.com/paritytech/substrate-contracts-node) repository to setup a local Substrate node

### Project setup 
- Run the following commands
```bash
git clone https://github.com/marlowl/ink-voter-contract
cd ink-voter-contract
cargo +nightly contract build
```

- It builds a `./target/ink` folder. This folder contains the `voter_sample.contract` file
- Go to Parity's [contracts ui](https://paritytech.github.io/contracts-ui/#/add-contract)
- Make sure your local Substrate node is running
- Upload the `voter_sample.contract` file
- Visit the [PolkadotJs](https://polkadot.js.org/apps/#/explorer) explorer
- Target your local node as network
- Look for the `contract.Instantiated` event
- Copy the contract address and paste it [here](https://github.com/marlowl/voter-contract-ui/blob/main/src/App.js#L46)
- Run `yarn install` && `yarn start` to play with the Voter contract UI! :smile:
