const axios = require("axios");
const bitcore = require("bitcore-lib");
const TESTNET = true

module.exports = sendBitcoin = async (recieverAddress, amountToSend) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const sourceAddress = process.env.PUBLIC_ADDRESS;
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;

    const recommendedFee = await axios.get(
      "https://bitcoinfees.earn.com/api/v1/fees/recommended"
    );

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    const resp = await axios({
        method: "GET",
        url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
    });
    const utxos = resp.data

    for (const utxo of utxos) {
      let input = {};
      input.satoshis = utxo.value;
      input.script = bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex();
      input.address = sourceAddress;
      input.txId = utxo.txid;
      input.outputIndex = utxo.vout;
      totalAmountAvailable += utxo.value;
      inputCount += 1;
      inputs.push(input);
    }

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;

    fee = transactionSize * recommendedFee.data.hourFee / 3; // satoshi per byte
    if (TESTNET) {
      fee = transactionSize * 1 // 1 sat/byte is fine for testnet
    }
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }
    //Set transaction input
    transaction.from(inputs);
    transaction.to(recieverAddress, satoshiToSend);
    transaction.change(sourceAddress);
    transaction.fee(Math.round(fee));
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();
    const result = await axios({
      method: "POST",
      url: `https://blockstream.info/testnet/api/tx`,
      data: serializedTransaction,
    });
    return result.data;
  } catch (error) {
    return error;
  }
};