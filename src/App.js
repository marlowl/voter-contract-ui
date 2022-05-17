import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Button } from 'baseui/button';
import abi from './metadata.json'
import { HeadingXLarge } from 'baseui/typography'
import { Block } from 'baseui/block'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { ApiPromise, WsProvider } = require("@polkadot/api");
const { ContractPromise } = require("@polkadot/api-contract");
const { keyring } = require("@polkadot/ui-keyring");
const engine = new Styletron();

keyring.loadAll({ ss58Format: 42, type: "sr25519" });

const loadContract = async () => {
  const provider = new WsProvider("ws://127.0.0.1:9944");
  const api = await ApiPromise.create({ provider });

  const contractAddress = "5DszehVJ6pS7QpAwDoiWNFiQgvDxFJHrPnEWm5dGRkpwpVXh";
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
  try {
    await contract.tx
      .incrementMyVote({})
      .signAndSend(alicePair, (status) => {
        if (status.isCompleted) {
          toast.success("Increment transaction completed!");
        }
      })
  } catch (err) {
    console.log(err)
  }
}

const decrementMyVote = async () => {
  const contract = await loadContract()
  const alicePair = keyring.createFromUri("//Alice");
  try {
    await contract.tx
      .decrementMyVote({})
      .signAndSend(alicePair, (status) => {
        if (status.isCompleted) {
          toast.success("Decrement transaction completed!");
        }
      })
  } catch (err) {
    console.log(err)
  }
}

export default function Hello() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Block width="100%" maxWidth="768px" margin="0 auto" padding="0 16px 24px">

          <title>Voter contract ui</title>

          <Block
            as="header"
            height="120px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Block display="flex" alignItems="center">
              <HeadingXLarge as="div">Voter contract ui</HeadingXLarge>
            </Block>
          </Block>

          <main>
            <Button onClick={() => getMyVote()}>Get my vote</Button>
            <Button onClick={() => getTotalVotes()}>Get total votes</Button>
            <Button onClick={() => incrementMyVote()}>Increment my vote</Button>
            <Button onClick={() => decrementMyVote()}>Decrement my vote</Button>
          </main>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          {/* Same as */}
          <ToastContainer />
        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
}
