const { PrivateKey } = require("bitcore-lib");
const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");

const createWallet = (network = mainnet) => {

  var privateKey = new PrivateKey();
  var address = privateKey.toAddress(network);
  return {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };
};
const createHDWallet = (network = mainnet) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.SPANISH);
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  console.log({
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
})
};

createHDWallet();