import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Button } from 'baseui/button';
import abi from './metadata.json';
import { HeadingXLarge } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Input } from 'baseui/input';
import { HeadingMedium } from 'baseui/typography';
import { Select } from 'baseui/select';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { ApiPromise, WsProvider } = require('@polkadot/api');
const { ContractPromise } = require('@polkadot/api-contract');
const { keyring } = require('@polkadot/ui-keyring');

const webSocketEndpoint = 'ws://127.0.0.1:9944';
const socket = new WebSocket(webSocketEndpoint);
socket.onopen = function () {
  toast.success('Node connected!', toasterOptions);
};
socket.onerror = function () {
  toast.error('Node not connected!', toasterOptions);
};

const engine = new Styletron();
const toasterOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

keyring.loadAll({ ss58Format: 42, type: 'sr25519' });

const loadContract = async () => {
  const provider = new WsProvider(webSocketEndpoint);
  const api = await ApiPromise.create({ provider });

  const contractAddress = '';
  const contract = new ContractPromise(api, abi, contractAddress);

  return contract;
};

export default function App() {
  useEffect(() => {
    (async () => {
      await getMyVote();
      await getTotalVotes();
    })();
  });

  const [totalVotes, setTotalVotes] = useState('');
  const [myVotes, setMyVotes] = useState('');
  const [account, setAccount] = useState([{ label: 'Alice', id: '//Alice' }]);

  const value = 0;
  const gasLimit = 1000000000000;
  const keyRingAccount = keyring.createFromUri(account[0].id);

  const incrementMyVote = async () => {
    const contract = await loadContract();
    try {
      await contract.tx
        .incrementMyVote({})
        .signAndSend(keyRingAccount, async (status) => {
          if (status.isCompleted) {
            const myVotes = await getMyVote();
            setMyVotes(myVotes);

            const totalVotes = await getTotalVotes();
            setTotalVotes(totalVotes);

            toast.success(`Increment transaction for ${account[0].label} completed!`, toasterOptions);
          }
        });
    } catch (err) {
      toast.error(`Increment transaction for ${account[0].label} failed!`, toasterOptions);
      console.log(err);
    }
  };

  const decrementMyVote = async () => {
    const contract = await loadContract();
    try {
      await contract.tx
        .decrementMyVote({})
        .signAndSend(keyRingAccount, async (status) => {
          if (status.isCompleted) {
            const myVotes = await getMyVote();
            setMyVotes(myVotes);

            const totalVotes = await getTotalVotes();
            setTotalVotes(totalVotes);

            toast.success(`Decrement transaction for ${account[0].label} completed!`, toasterOptions);
          }
        });
    } catch (err) {
      toast.error(`Decrement transaction for ${account[0].label} failed!`, toasterOptions);
      console.log(err);
    }
  };

  const getMyVote = async () => {
    const contract = await loadContract();
    const { output } = await contract.query.getMyVote(
      keyRingAccount.address,
      { value, gasLimit },
    );

    const myVotes = output?.toString();
    if (myVotes) {
      setMyVotes(myVotes);
    } else {
      toast.error('Contract address not found!');
    }
  };

  const getTotalVotes = async () => {
    const contract = await loadContract();
    const { output } = await contract.query.getTotalVotes(
      keyRingAccount.address,
      { value, gasLimit },
    );

    const totalVoutes = output?.toString();
    if (totalVoutes) {
      setTotalVotes(totalVoutes);
    }
  };

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Block width="100%" maxWidth="768px" margin="0 auto" padding="0 16px 24px">
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

          <HeadingMedium as="h1">
            Account Selector
          </HeadingMedium>
          <Select
            clearable={false}
            options={[
              { label: 'Alice', id: '//Alice' },
              { label: 'Bob', id: '//Bob' },
              { label: 'Charlie', id: '//Charlie' },
              { label: 'Dave', id: '//Dave' },
              { label: 'Eve', id: '//Eve' },
              { label: 'Ferdie', id: '//Ferdie' },
            ]}
            value={account}
            placeholder="Select account"
            onChange={(params) => setAccount(params.value)}
          />

          <HeadingMedium as="h1">
            My votes
          </HeadingMedium>
          <Block display="flex">
            <Button onClick={() => incrementMyVote()}>
              Increase
            </Button>
            <Input
              value={`My total votes: ${(myVotes) || ''}`}
              disabled
            />
            <Button onClick={() => decrementMyVote()}>
              Decrease
            </Button>
          </Block>

          <HeadingMedium as="h1">
            Total amount of votes present in smart contract
          </HeadingMedium>
          <Block display="flex">
            <Input
              overrides={{
                Root: {
                  style: ({ $theme }) => ({
                    flex: 1,
                    marginRight: $theme.sizing.scale400,
                  }),
                },
              }}
              value={`Votes present in smart contract: ${(totalVotes) || ''}`}
              disabled
            />
          </Block>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
          />

        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
}
