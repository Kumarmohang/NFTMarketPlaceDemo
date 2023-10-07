

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';


function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

async function getAddress() {
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
}

function updateButton() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  ethereumButton.textContent = "Connected";
  ethereumButton.classList.remove("hover:bg-blue-70");
  ethereumButton.classList.remove("bg-blue-500");
  ethereumButton.classList.add("hover:bg-green-70");
  ethereumButton.classList.add("bg-green-500");
}

async function connectWebsite() {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
    });
}
const ethers = require("ethers");
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();
const addr = await signer.getAddress();
updateAddress(addr);

    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        // getAddress();
        
        // window.location.replace(location.pathname)
      });
}

  useEffect(() => {
    if(window.ethereum == undefined)
      return;
    let val = window.ethereum.isConnected();
    if(val)
    {
      console.log("here");
      getAddress();
      console.log("its working after the get address")
      toggleConnect(val);
      updateButton();
    }

    // window.ethereum.on('accountsChanged', function(accounts){
    //   window.location.replace(location.pathname)
    // })
    console.log("at end")
  });

    return (
      <div className="">
        <nav className="w-screen">
          <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
            {/* <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/> */}
            <div className='inline-block font-bold text-xl ml-2'>
               Sasol NFT Marketplace
            </div>
            </Link>
          </li>
          <li className='w-3/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              {location.pathname === "/" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/">Marketplace</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/">Marketplace</Link>
              </li>              
              }
              {location.pathname === "/sellNFT" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/sellNFT">Create An NFT</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/sellNFT">Create An NFT</Link>
              </li>              
              }
              {location.pathname === "/sold" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/sold">Sold NFT</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/sold">Sold NFT</Link>
              </li>              
              }              
              {location.pathname === "/profile" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>              
              }
              {location.pathname === "/exchange" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/exchange">Exchange</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/exchange">Exchange</Link>
              </li>              
              }   
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
              </li>
            </ul>
          </li>
          </ul>
        </nav>
        <div className='text-white text-bold text-right mr-10 text-sm'>
          {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
        </div>
      </div>
    );
  }

  export default Navbar;