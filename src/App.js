import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Button } from 'baseui/button';
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { ContractPromise } = require("@polkadot/api-contract");
const { keyring } = require("@polkadot/ui-keyring");
keyring.loadAll({ ss58Format: 42, type: "sr25519" });

const engine = new Styletron();

const getMyVote = async () => {
  const provider = new WsProvider("ws://127.0.0.1:9944");
  const api = await ApiPromise.create({ provider });
  const abi = require("./metadata.json");

  const contractAddress = "5FkfsfMv7TaLSu5qiKANN2sZucsmuBmERqNQyJ4vqDUZ7XYg";
  const contract = new ContractPromise(api, abi, contractAddress);

  const alicePair = keyring.createFromUri("//Alice");

  const value = 0;
  const gasLimit = 1000000000000;
  const { output } = await contract.query.getMyVote(
      alicePair.address,
      { value, gasLimit }
  );
  console.log(output.toHuman())
}

export default function Hello() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
          <Button onClick={() => getMyVote()}>Get my vote</Button>
      </BaseProvider>
    </StyletronProvider>
  );
}
