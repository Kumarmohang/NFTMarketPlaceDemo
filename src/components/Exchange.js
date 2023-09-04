import React, { useState } from "react";
import "../AuthStyle.css";
import { ethers } from "ethers";

import {Marketcontract} from './Functions';
const URL ="https://goerli.etherscan.io/tx/"

const Exchange = () => {
  const [token, setToken] = useState("");
  const [eth, setEth] = useState("");
  async function Buy(e) {
    e.preventDefault();
    let MP= Marketcontract();
    try{
        const tx = await MP.BuyRewardTokes({ value: token });
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
        const tx = await MP.ExchangeRewardTokenWithEth(eth);
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
      <div className="form-contrainer">
        <h1>Buy Loyalty Tokens </h1>
        <form >
        <table >
            <tr>
                <td>
                    <label>Enter Ether</label>
                </td>
                <td>
                    <input type="text" onChange={(e)=>{
                        console.log(e.target.value);
                        setToken(e.target.value)
                    }}/>
                </td>
            </tr>
           <tr></tr> 
        </table>
        <br/>
        <button  onClick={Buy}>BuyLoyalty Tokens</button>
        </form>
      </div>
      <div className="form-contrainer">
        <h1>Exchange Loyalty</h1>
        <form >
        <table >
            <tr>
                <td>
                    <label>Enter Token</label>
                </td>
                <td>
                    <input type="text" onChange={(e)=>{
                        console.log(e.target.value);
                        setEth(e.target.value)
                    }}/>
                </td>
            </tr>
           <tr></tr> 
        </table>
        <br/>
        <button  onClick={ExChangeEth}>Exchange for Ethereum</button>
        </form>
      </div>
    </>
  );
};

export default Exchange;