import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import { ethers } from "ethers";
import MarketplaceABI from '../Marketplaceabi.json';
import NFTABI from '../NFTABI.json';
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";


export default function Marketplace() {
const sampleData = [
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    if (window.ethereum) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
      });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
      });
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  console.log('Signer', signer, 'addr', addr);
    
    //Pull the deployed contract instance
    let NFTContract = new ethers.Contract(process.env.REACT_APP_NFT,NFTABI,signer);
    let contract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE,MarketplaceABI,signer);
    //create an NFT Token
    console.log("befroe tx")
    let transaction = await contract.fetchMarketItems()
    console.log("transaction details ",transaction);

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await NFTContract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                 NFTs
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}