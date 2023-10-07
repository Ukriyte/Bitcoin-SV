const { testnet, mainnet } = require("bitcore-lib/lib/networks");
const sendBitcoin = require("./send-bsv");

sendBitcoin(process.env.Reciever_Address, 0.0001)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

