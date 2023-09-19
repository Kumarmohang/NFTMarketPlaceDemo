
const {TokenUnpauseTransaction,TokenPauseTransaction,TokenType,Hbar,AccountCreateTransaction,Client,PrivateKey,TokenCreateTransaction,TokenAssociateTransaction,TransferTransaction,TokenSupplyType}= require('@hashgraph/sdk');

const operation = require('./operator.json');

const myaccountId = operation.MY_ACCOUNT_ID;
const myaccountPrivateforPublic = PrivateKey.fromString(operation.MY_PRIVATE_KEY);
const mypublickey = myaccountPrivateforPublic.publicKey;
const myPrivateKey =operation.MY_PRIVATE_KEY;
let NewAccountId;
const Newprivatekey = PrivateKey.generateED25519();
const Newpublickey= Newprivatekey.publicKey;
let tokenId;
let client;
async function Account(){

    client = Client.forTestnet();
    client.setOperator(myaccountId,myPrivateKey);

    const tx = await new AccountCreateTransaction()
    .setKey(Newpublickey)
    .setInitialBalance(new Hbar(10))
    .execute(client);

    const getReceipt = await tx.getReceipt(client);
    const account = getReceipt.accountId;
    NewAccountId=account.toString();
    console.log("account id is",account.toString());
// }

// async function TokenCreate(){
//     // TOken Create
//     await Account();
    const token = await new TokenCreateTransaction()
    .setTokenName("Mohan")
    .setTokenType(TokenType.FungibleCommon)
    .setTokenSymbol("MG")
    .setAdminKey(mypublickey)
    .setTreasuryAccountId(NewAccountId)
    .setDecimals(2)
    .setInitialSupply(35050)
    .setMaxSupply(50000)
    .setSupplyType(TokenSupplyType.Finite)
    .setSupplyKey(Newpublickey)
    .setPauseKey(mypublickey)
    .freezeWith(client)
    .sign(Newprivatekey);
    
    const exe = await token.execute(client)
    const txgetReceipt = await exe.getReceipt(client);
    const tokentx = txgetReceipt.tokenId;
    tokenId = tokentx.toString();
    console.log("token is ",tokenId);
// }

// async function TokenAssociation(){
//     await TokenCreate();
    const tx3 = await new TokenAssociateTransaction()
    .setAccountId(myaccountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(myaccountPrivateforPublic)
    
    const exe3 = await tx3.execute(client);
// }

// async function sendToken(){
//     await TokenAssociation();
    const sendToken = await new TransferTransaction()
    .addTokenTransfer(tokenId,NewAccountId,-25050)
    .addTokenTransfer(tokenId,myaccountId,25050)
    .freezeWith(client)
    .sign(Newprivatekey);
   
    const ex = await sendToken.execute(client);
    const getReceipt2= await ex.getReceipt(client);
    console.log("send token Status is",getReceipt2.status.toString());
// }


// async function Pause(){
//     await sendToken();
    const pause = await new TokenPauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(myaccountPrivateforPublic)

    const exe1 = await pause.execute(client)
    const res2 = await exe1.getReceipt(client)
    const txstatus2 = res2.status;
    console.log("Token pause is",txstatus2.toString());
// }
// async function UnPause(){
//     await Pause();
    const tx4 = await new TokenUnpauseTransaction()
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(myaccountPrivateforPublic);

    const exe4 = await tx4.execute(client);
    const res = await exe4.getReceipt(client);
    const txstatus = res.status;
    console.log("UnPause token status",txstatus.toString());
}





Account();