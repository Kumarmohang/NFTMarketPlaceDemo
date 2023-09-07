

import { ethers } from "ethers";
import MarketplaceABI from '../Marketplaceabi.json';
import NFTABI from '../NFTABI.json';


const REACT_APP_PRIVATEKEY="0x621937a0781249e7500508995a1cf810823b1c31782fdc0319dc43209efd81be";
const REACT_APP_NETWORK="goerli";
const REACT_APP_APIKEY="4fade95fbf654443a119bb3a5c1f36c7";
const REACT_APP_MARKETPLACE="0x8DdE6FdcF02288959069b2aEE19f33aC8172cdAD";
const REACT_APP_NFT="0x6e6417f7a58B4870575b9c96FaaF3cd1b7b6D254";


const infuraProvider = new ethers.providers.InfuraProvider(
    REACT_APP_NETWORK,
    REACT_APP_APIKEY,
  );

  let address 
  let signer = new ethers.Wallet(REACT_APP_PRIVATEKEY, infuraProvider);
  function NFTcontract() {
    let NFTContract = new ethers.Contract(REACT_APP_NFT,NFTABI,signer);
    return NFTContract;
  }

  function Marketcontract (){
    let MarketContract = new ethers.Contract(REACT_APP_MARKETPLACE,MarketplaceABI,signer);
    return MarketContract;
  }

  function Signer(){
    return signer;
  }
  function Provider(){
    return infuraProvider;
  }

  export {NFTcontract,Marketcontract,Signer,Provider};
