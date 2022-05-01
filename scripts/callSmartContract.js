const abi = require("../abi/ZombieOwnership.json");
const Web3 = require("web3");
const Provider = require("@truffle/hdwallet-provider");

require("dotenv").config();
async function startApp() {
  const cryptoZombiesABI = abi.abi;
  const cryptoZombiesAddress = "0x61eb8cb6db748b078dd66290844705cd89f525ad";
  const myAccount = "0x2c17bf990f33afcfde985e19137a92b1c486d0e1";
  const web3 = new Web3(process.env.ALCHEMY_KEY);
  const networkId = await web3.eth.net.getId();
  let cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);

  const tx = cryptoZombies.methods.createRandomZombie("New Zombie");
  const gas = await tx.estimateGas({ from: myAccount });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(myAccount);

  const txData = {
    from: myAccount,
    to: cryptoZombiesAddress,
    data,
    gas,
    gasPrice,
    nonce,
    chain: "rinkeby",
    hardfork: "petersburg",
  };

  //   const receipt = await web3.eth.sendTransaction(txData);
  //   console.log(`Transaction hash: ${receipt.transactionHash}`);

  console.log(`Zombie : ${await cryptoZombies.methods.getZombiesByOwner(myAccount).call()}`);

  //   cryptoZombies.methods.zombies(id).call();
}

// startApp();

//Easy way (Web3 + @truffle/hdwallet-provider)
const init3 = async () => {
  try {
    const provider = new Provider(process.env.PRIVATE_KEY, process.env.ALCHEMY_KEY);
    const web3 = new Web3(provider);
    const cryptoZombiesABI = abi.abi;
    var cryptoZombiesAddress = "0x61eb8cb6db748b078dd66290844705cd89f525ad";
    const myAccount = "0x2c17bf990f33afcfde985e19137a92b1c486d0e1";

    const myContract = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

    let zombie = await myContract.methods.zombies(0).call();
    console.log(`Zombie level: ${zombie.level}`);

    const receipt = await myContract.methods.levelUp(0).send({ from: myAccount, value: web3.utils.toWei("0.001", "ether") });

    console.log(`Transaction hash: ${receipt.transactionHash}`);

    zombie = await myContract.methods.zombies(0).call();
    console.log(`Zombie level: ${zombie.level}`);

    provider.engine.stop();
  } catch (e) {
    console.error(e);
  }
};

init3();
