// Required imports
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { ContractPromise } = require("@polkadot/api-contract");
const { keyring } = require("@polkadot/ui-keyring");
keyring.loadAll({ ss58Format: 42, type: "sr25519" });

const abi = require("./metadata.json");

async function main() {
    const provider = new WsProvider("ws://127.0.0.1:9944");
    const api = await ApiPromise.create({ provider });

    const contractAddress = "5Fk5oDkKzGrvNAQqKTf3j9H3NCDFi3XaMR5iMjR4hrfUWQfq";
    const contract = new ContractPromise(api, abi, contractAddress);

    const alicePair = keyring.createFromUri("//Alice");

    const value = 0;
    const gasLimit = 1000000000000;
    const { gasConsumed, result, output } = await contract.query.getMyVote(
        alicePair.address,
        { value, gasLimit }
    );
    console.log(result.toHuman());
    console.log(gasConsumed.toHuman());

    if (result.isOk) {
        console.log("Success", output.toHuman());
    } else {
        console.error("Error", result.asErr);
    }
}

main()
    .catch(console.error)
    .finally(() => process.exit());