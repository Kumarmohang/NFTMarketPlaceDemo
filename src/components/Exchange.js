import React, { useState,useEffect } from "react";
import "../AuthStyle.css";
import { ethers } from "ethers";

import {Marketcontract,Signer,Provider} from './Functions';
const URL ="https://goerli.etherscan.io/tx/"

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
    let signer=Signer();
    const addr = await signer.getAddress();
        setAddress(addr);
        
        let provider =Provider();
        const bala =  await provider.getBalance(address);
       let one = ethers.utils.formatEther(bala);
       const addressBal =  await provider.getBalance("0x8DdE6FdcF02288959069b2aEE19f33aC8172cdAD");
       let addBalance = ethers.utils.formatEther(addressBal)
       setbalance(one);
       setcontractBalance(addBalance);
       let MP= Marketcontract();
       let tokenBal= await MP.balanceOf(address);
       let tokenBalance = ethers.utils.formatEther(addressBal)
       setmytokenbalance(tokenBalance)
       
        

}

  async function Buy(e) {
    e.preventDefault();
    let MP= Marketcontract();
    let signer=Signer();
        // const signer = provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
        console.log("ethe value is",eth)

        const _value=ethers.utils.parseUnits(eth.toString(), 'ether');
    // const _value=ethers.utils.parseEther(amount);
    console.log("value si",_value)
    
    try{
        const tx = await MP.BuyRewardTokes({ value: _value });
    await tx.wait();
    const hash = tx.hash;
    console.log("tx hash is ",hash);
    console.log(URL+hash);
    console.log("ethe transaction completed successfully",tx);
    } catch(error){
        console.log("Error",error);
    }
    
}

const ExChangeEth =async(e)=>{
    e.preventDefault();
    try{
        let MP =Marketcontract();
        // const amount= eth*10**18;
        // ethers.utils.parseUnits(nft.price.toString(), 'ether');
        console.log("ether ",selltoken)
    // const _value=ethers.utils.parseEther(selleth.toString());
    const _value=ethers.utils.parseUnits(selleth.toString(), 'ether');
    console.log("value si",_value)
        const tx = await MP.ExchangeRewardTokenWithEth(_value);
    await tx.wait();
    const hash = tx.hash;
    console.log("tx hash is ",hash);
    console.log(URL+hash);
    console.log("Exchange transaction completed successfully",tx);
    } catch(error){
        console.log("Error",error);
    }
}
  return (
    <>
    {/* <h2 className="h2-container">1 Eth=100 Loyalty Tokens</h2> */}
    <br/>
    <h1 className="h1-container">Wallet Bal : {balance}</h1>
    <h2  className="h1-container">My Loyalty Balance: {mytokenbalance}</h2>
    <h1 className="h1-my"> contract Eth balance : {contractBalance} </h1>
      <div className="form-contrainer">
        <h1 className=".h2-container">1 Eth = 100 Loyalty Tokens </h1>
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