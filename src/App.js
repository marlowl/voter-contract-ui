import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Button } from 'baseui/button';
import abi from './metadata.json'

const { ApiPromise, WsProvider } = require("@polkadot/api");
const { ContractPromise } = require("@polkadot/api-contract");
const { keyring } = require("@polkadot/ui-keyring");
const engine = new Styletron();

keyring.loadAll({ ss58Format: 42, type: "sr25519" });

const loadContract = async () => {
  const provider = new WsProvider("ws://127.0.0.1:9944");
  const api = await ApiPromise.create({ provider });
  
  const contractAddress = "5FkfsfMv7TaLSu5qiKANN2sZucsmuBmERqNQyJ4vqDUZ7XYg";
  const contract = new ContractPromise(api, abi, contractAddress);

  return contract
}

const getMyVote = async () => {
  const contract = await loadContract()
  const alicePair = keyring.createFromUri("//Alice");

  const value = 0;
  const gasLimit = 1000000000000;
  const { output } = await contract.query.getMyVote(
      alicePair.address,
      { value, gasLimit }
  );
  console.log(output.toHuman())
}

const getTotalVotes = async () => {
  const contract = await loadContract()
  const alicePair = keyring.createFromUri("//Alice");

  const value = 0;
  const gasLimit = 1000000000000;
  const { output } = await contract.query.getTotalVotes(
      alicePair.address,
      { value, gasLimit }
  );
  console.log(output.toHuman())
}

const incrementMyVote = async () => {
  const contract = await loadContract()
  const alicePair = keyring.createFromUri("//Alice");
  const {output} = await contract.tx
  .incrementMyVote({})
  .signAndSend(alicePair, (status) => {
      console.log(status.isFinalized)
  })  
}

const decrementMyVote = async () => {
  const contract = await loadContract()
  const alicePair = keyring.createFromUri("//Alice");
  const {output} = await contract.tx
  .decrementMyVote({})
  .signAndSend(alicePair, (status) => {
      console.log(status.isFinalized)
  })  
}

export default function Hello() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
          <Button onClick={() => getMyVote()}>Get my vote</Button>
          <Button onClick={() => getTotalVotes()}>Get total votes</Button>
          <Button onClick={() => incrementMyVote()}>Increment my vote</Button>
          <Button onClick={() => decrementMyVote()}>Decrement my vote</Button>
      </BaseProvider>
    </StyletronProvider>
  );
}
