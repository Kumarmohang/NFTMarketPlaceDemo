import Navbar from "./Navbar";
import {  useParams } from 'react-router-dom';
import MarketplaceABI from '../Marketplaceabi.json';
import NFTABI from '../NFTABI.json';
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";


let signer;
export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");
const [tokenid,setTokenid]=useState("");
const [price,setprice]=useState("");
const [buyPrice,setBuyPrice]=useState("");
const [partner,setPartner]=useState("");
const [newmessage,setNewMessage]=useState("");

async function getNFTData(tokenId) {
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
                let MarketContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE,MarketplaceABI,signer);
    //Pull the deployed contract instance
   
    //create an NFT Token
    var tokenURI = await NFTContract.tokenURI(tokenId);
    const listedToken = await MarketContract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);
    // console.log("token id is ",listedToken.tokenId.toNumber());
    setTokenid(listedToken.tokenId.toNumber());
    

    let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("partner address",listedToken.partners);
    setPartner(listedToken.partners);
    setBuyPrice(meta.price*100)
    console.log("amount tokens are ",meta.price*100);
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
              await provider.send("eth_requestAccounts", []);
               signer = provider.getSigner();
              const addr = await signer.getAddress();
              console.log('Signer', signer, 'addr', addr);
              
     
              setNewMessage(`${buyPrice} Loyalty has been transferted to the Partner address ${partner} `);
       let MarketContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE,MarketplaceABI,signer);

        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await MarketContract.createMarketSale(process.env.REACT_APP_NFT,tokenId, {value:salePrice});
        await transaction.wait();
        

        alert('You successfully bought the NFT!');
        alert(`${buyPrice} Loyalty has been transferted to the Partner address ${partner} `)
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

async function ListNFT(tokenId) {
    try {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
              await provider.send("eth_requestAccounts", []);
               signer = provider.getSigner();
              const addr = await signer.getAddress();
             
     
    
       let MarketContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE,MarketplaceABI,signer);
       let NFTContract = new ethers.Contract(process.env.REACT_APP_NFT,NFTABI,signer);

        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function

        // NFT again 
        let Txapprove = await NFTContract.approve(process.env.REACT_APP_MARKETPLACE,tokenid);
        await Txapprove.wait();
        const _price = ethers.utils.parseUnits(price, 'ether')
        let transaction = await MarketContract.RelistNFT(process.env.REACT_APP_NFT,tokenId, _price);
        await transaction.wait();

        alert('You successfully listed NFT!',"token id ",tokenid);
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);
    if(typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);

    return(
        <div style={{"min-height":"100vh"}}>
            <Navbar></Navbar>
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " ETH"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                    { currAddress != data.owner && currAddress != data.seller ?
                        <div>
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                        {/* {newmessage}  */}
                        </div>
                        : <div className="text-emerald-7">You are the owner of this NFT</div>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                    <div>
                    { data.owner != "0x0000000000000000000000000000000000000000" ?
                    <div>
                        
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01"  onChange={(e) => {setprice(e.target.value);console.log(e.target.value)}}></input>
                    <br />
                    <div className="mb-6">
                    <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => ListNFT(tokenId)}>List An NFT</button>

                    </div>
                        </div>
                        : <div className="text-emerald-7"></div>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}