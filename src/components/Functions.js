

import { ethers } from "ethers";
import MarketplaceABI from '../Marketplaceabi.json';
import NFTABI from '../NFTABI.json';


const REACT_APP_PRIVATEKEY=process.env.REACT_APP_PRIVATEKEY;
const REACT_APP_NETWORK=process.env.REACT_APP_NETWORK;
const REACT_APP_APIKEY=process.env.REACT_APP_APIKEY;
const REACT_APP_MARKETPLACE=process.env.REACT_APP_MARKETPLACE;
const REACT_APP_NFT=process.env.REACT_APP_NFT;

const infuraProvider = new ethers.providers.InfuraProvider(
    REACT_APP_NETWORK,
    REACT_APP_APIKEY,
  );

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

  export {NFTcontract,Marketcontract,Signer};
