import Navbar from "./Navbar";
import {  useParams } from 'react-router-dom';
import MarketplaceABI from '../Marketplaceabi.json';
import NFTABI from '../NFTABI.json';
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";


export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        
        let sumPrice = 0;
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
              updateAddress(addr);
              console.log('Signer', signer, 'addr', addr);
              console.log("env data is ",process.env.REACT_APP_NFT);
                
                //Pull the deployed contract instance
                let NFTContract = new ethers.Contract(process.env.REACT_APP_NFT,NFTABI,signer);
                let MarketContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE,MarketplaceABI,signer);


        //create an NFT Token
        let transaction = await MarketContract.fetchItemsCreated()
        console.log("transaction details is",transaction);

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async i => {
            
            const tokenURI = await NFTContract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
            console.log("metaData is ",meta)

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
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return (
        <div className="profileClass" style={{"min-height":"100vh"}}>
            <Navbar></Navbar>
            <div className="profileClass">
            <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                <div className="mb-5">
                    <h2 className="font-bold">Wallet Address</h2>  
                    {address}
                </div>
            </div>
            <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                    <div>
                        <h2 className="font-bold">No. of NFTs</h2>
                        {data.length}
                    </div>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value</h2>
                        {totalPrice} ETH
                    </div>
            </div>
            <div className="flex flex-col text-center items-center mt-11 text-white">
                <h2 className="font-bold">Your NFTs</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {data.length == 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
                </div>
            </div>
            </div>
        </div>
    )
};