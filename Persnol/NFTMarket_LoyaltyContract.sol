// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract NFTMarket is ReentrancyGuard,ERC20 {
    using Counters for Counters.Counter;
    using SafeMath for uint;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    uint public Rate=100;
    address payable owner;
    uint256 listingPrice = 0.0001 ether;
 
    constructor(uint _totalSupply) ERC20("Loyalty","SAS") {
         _mint(address(this), _totalSupply* 10**18);
         owner = payable(msg.sender);
    }
 
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address partners;
        uint256 price;
        bool sold;
    }
 
    mapping(uint256 => MarketItem) private idToMarketItem;
 
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    function getListedTokenForId(uint256 tokenId) public view returns (MarketItem memory) {
        return idToMarketItem[tokenId];
    }
 
    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
 
    /* Places an item for sale on the marketplace */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        address _partners,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");
 
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
 
        idToMarketItem[itemId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        _partners,
        price,
        false
        );
 
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }
 
    /* list the Itemid in Market again for trading */
    function RelistNFT(address _nftContract, uint itemId,uint _price) external payable nonReentrant {
        require(_price>0,"price shold be GT zero");
        uint tokenId = idToMarketItem[itemId].tokenId;
        address partners= idToMarketItem[itemId].partners;
        
        idToMarketItem[itemId] =  MarketItem(
        itemId,
        _nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(0)),
        partners,
        _price,
        false
        );

        IERC721(_nftContract).transferFrom(msg.sender, address(this), tokenId);
 
        emit MarketItemCreated(
            itemId,
            _nftContract,
            tokenId,
            msg.sender,
            address(0),
            _price,
            false
        );
    }


    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        address _partners=idToMarketItem[itemId].partners;
        require(msg.value >= price, "Please submit the asking price in order to complete the purchase");
 
        idToMarketItem[itemId].seller.transfer(msg.value);
        uint ethPrice =uint(msg.value);
        uint token= ethPrice.mul(20).div(100);
        uint amount = Rate.mul(token);
        payable(owner).transfer(listingPrice);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        IERC20(address(this)).transfer(_partners, amount);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
       
    }
 
    // /* Returns all unsold market items */
    // function fetchMarketItems() public view returns (MarketItem[] memory) {
    //     uint itemCount = _itemIds.current();
    //     uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    //     uint currentIndex = 0;
 
    //     MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    //     for (uint i = 0; i < itemCount; i++) {
    //         if (idToMarketItem[i + 1].owner == address(0)) {
    //             uint currentId = i + 1;
    //             MarketItem storage currentItem = idToMarketItem[currentId];
    //             items[currentIndex] = currentItem;
    //             currentIndex += 1;
    //         }
    //     }
    //     return items;
    // }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
 
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                itemCount += 1;
            }
        }
 
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
  

    
     /* Returns all sold market items */
    
    function SoldNFT() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
 
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner != address(0)) {
                itemCount += 1;
            }
        }
 
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner != address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
 
    /* Returns onlyl items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
 
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
 
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
 
    /* Returns only items a user has created */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
 
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
 
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    function BuyRewardTokes() external   payable nonReentrant {
        require(msg.value >0,"Eth should should be greater");
        uint amount = Rate * uint(msg.value);
        (bool success,)= address(this).call{value:msg.value}("");
        require(success,"tx failed");
        IERC20(address(this)).transfer(msg.sender, amount);
    }
 
    function ExchangeRewardTokenWithEth(uint _amount) external {
        require(_amount > 0,"less Amount");
        uint exchage = Rate/_amount;
        require(address(this).balance >= exchage,"not suffient Eth");
        transfer(address(this), _amount);
        (bool success,)=msg.sender.call{value:exchage}("");
        require(success,"tx failed");
    }
    receive() external payable {}
   
    function witheth() external {
        require(msg.sender == owner,"you are not owner");
        uint bal= address(this).balance;
        require(bal>0,"address dont have money");
        (bool success,)=msg.sender.call{value:bal}("");
        require(success,"tx failed");
    }
}
 