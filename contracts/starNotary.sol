pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

  

    struct Star {
        string name;
    }

//  Add a name and a symbol for your starNotary tokens
string public  name = "Abdulaziz Token";
string public  symbol = "AZIZ";

//

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    //mapping between address and owned starts
    mapping(address => uint256[]) ownedTokens;
     // Mapping from token ID to index of the owner token list
  mapping(uint256 => uint256) private ownedTokensIndex;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
        
    }

// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string memory starName){
    Star memory lookupStar = tokenIdToStarInfo[_tokenId];
    starName = lookupStar.name;
    return starName;

}

//

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner1 = ownerOf(_tokenId);
        uint160 starOwner2 = uint160(starOwner1);
        address payable starOwner = address(starOwner2);
        require(msg.value >= starCost);

       // _removeTokenFrom(starOwner, _tokenId);
       // _addTokenTo(msg.sender, _tokenId);
        _transferFrom(starOwner, msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.
function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public{
    require(msg.sender == ownerOf(_tokenId1));
      address owner2 = ownerOf(_tokenId2);
    //require(owner2 != address(0));
     // putStarUpForSale(_tokenId1,0);
      _transferFrom(msg.sender, owner2, _tokenId1);
      _transferFrom(owner2, msg.sender, _tokenId2);



}


// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//
function transferStar(address _to, uint256 _tokenId) public {
    require(msg.sender == ownerOf(_tokenId));
    transferFrom(msg.sender, _to, _tokenId);
}

}
