// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.1;
 
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
 
    constructor(address marketplaceAddress) ERC721("SasolNFT", "NFT") {
        contractAddress = marketplaceAddress;
    }
 
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
 
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}

// 100000

// Market 0xCaa88C4Fc5ecbDA8538fA482A6cf2e51E6c71EB2
//NFT 0x76cD1Be9D9DE5E8D78CB3c7d24A2018017B14593