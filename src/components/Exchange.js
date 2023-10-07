import React, { useState,useEffect } from "react";
import "../AuthStyle.css";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import MarketplaceABI from '../Marketplaceabi.json';



const URL ="https://mumbai.polygonscan.com/tx/"
let signer;
let provider;
let MarketContract;
const Exchange = () => {
  const [token, setToken] = useState("");
  const [eth, setEth] = useState("");
  const [selltoken, setSellToken] = useState("");
  const [selleth, setsellEth] = useState("");
  const [address,setAddress]=useState("");
  const [Sasol,setSasol]=useState("");
  const [balance,setbalance]=useState("");
  const [contractBalance,setcontractBalance]=useState("");
  const [mytokenbalance,setmytokenbalance]=useState("");


  useEffect(() => {
    details();
  } );

async function details(){

    const ethers = require("ethers");
                if (window.ethereum) {
                    window.ethereum.on("chainChanged", () => {
                      window.location.reload();
                  });
                    window.ethereum.on("accountsChanged", () => {
                      window.location.reload();
                  });
              }
               provider = new ethers.providers.Web3Provider(window.ethereum);
              await provider.send("eth_requestAccounts", []);
               signer = provider.getSigner();
              const addr = await signer.getAddress();
              console.log('Signer', signer, 'addr', addr);
              setAddress(addr);
               
         MarketContract = new ethers.Contract(process.env.REACT_APP_MARKETPLACE,MarketplaceABI,signer);  
        const bala =  await provider.getBalance(address);
       let one = ethers.utils.formatEther(bala);
       const addressBal =  await provider.getBalance(process.env.REACT_APP_MARKETPLACE);
    
       let addBalance = ethers.utils.formatEther(addressBal)
       setbalance(one);
       setcontractBalance(addBalance);
       let tokenBal= await MarketContract.balanceOf(address);
       let tokenBalance = ethers.utils.formatEther(tokenBal)
       setmytokenbalance(tokenBalance)
       
       
        

}

  async function Buy(e) {
    e.preventDefault();
    
    
        // const signer = provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
        console.log("ethe value is",eth)

        const _value=ethers.utils.parseUnits(eth.toString(), 'ether');
    // const _value=ethers.utils.parseEther(amount);
    console.log("value si",_value)
    
    try{
        const tx = await MarketContract.BuyRewardTokes({ value: _value });
    await tx.wait();
    const hash = tx.hash;
    console.log("tx hash is ",hash);
    console.log(URL+hash);
    console.log("ethe transaction completed successfully",tx);
    alert(`Exchange transaction completed successfully ${URL+hash}`)
    } catch(error){
        console.log("Error",error);
    }
    
}

const ExChangeEth =async(e)=>{
    e.preventDefault();
    try{
        
        // const amount= eth*10**18;
        // ethers.utils.parseUnits(nft.price.toString(), 'ether');
        console.log("ether ",selltoken)
    // const _value=ethers.utils.parseEther(selleth.toString());
    const _value=ethers.utils.parseUnits(selleth.toString(), 'ether');
    console.log("value si",_value)
        const tx = await MarketContract.ExchangeRewardTokenWithEth(_value);
    await tx.wait();
    const hash = tx.hash;
    console.log("tx hash is ",hash);
    console.log(URL+hash);
    console.log("Exchange transaction completed successfully",tx);
    alert(`Exchange transaction completed successfully ${URL+hash}`)
    } catch(error){
        console.log("Error",error);
    }
}
  return (
    <>
    {/* <h2 className="h2-container">1 Eth=100 Loyalty Tokens</h2> */}
    <br/>
    <Navbar></Navbar>
    <h2 className="text-lg border-b-2 hover:pb-0 p-2 ">Wallet Bal : {balance}</h2>
    <h2  className="border-b-2 hover:pb-0 p-2">My Loyalty Balance: {mytokenbalance}</h2>
    <h2 className="border-b-2 hover:pb-0 p-2"> contract Eth balance : {contractBalance} </h2>
      <div className="form-contrainer">
        <h1 className="h2-container ">1 Eth = 100 Loyalty Tokens </h1>
        <form >
        <table >
            <tr>
                <td>
                    <label> Loyalty Tokens    </label>
                </td>
                <td>
                    <input type="text" onChange={(e)=>{
                        setToken(e.target.value);
                        setEth(e.target.value / 100);
                    }} value={token}/>
                </td>
            </tr>
            <br/>
            <tr></tr>
            <tr>
                <td>
                    <label>Ethers </label>
                </td>
                <td>
                    <input type="text" onChange={(e)=>{
                        console.log(e.target.value);
                        setEth(e.target.value);
                        setToken(e.target.value * 100);
                        
                    }} value={eth}/>
                </td>
            </tr>
        </table>
        <br/>
        <button  onClick={Buy}>BuyLoyalty Tokens</button>
        <br/>
        
        </form>
        <br/>
        <form >
        <table >
            
            <br/>
            <tr></tr>
            <tr>
                <td>
                    <label> Ethers </label>
                </td>
                <td>
                    <input type="text" onChange={(e)=>{
                        console.log(e.target.value);
                        setsellEth(e.target.value);
                        setSellToken(e.target.value * 100);
                        
                    }} value={selleth}/>
                </td>
            </tr>
            <br/>
            <tr>
                <td>
                    <label> Loyalty Tokens    </label>
                </td>
                <td>
                    <input type="text" onChange={(e)=>{
                        console.log(e.target.value);
                        setSellToken(e.target.value);
                        setsellEth(e.target.value / 100)
                        
                    }} value={selltoken}/>
                </td>
            </tr>
        </table>
        <br/>
        <button  onClick={ExChangeEth}>Sell Tokens</button>
        <br/>
        
        </form>
      </div>

      
      
    </>
  );
};

export default Exchange;