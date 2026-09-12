// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Minimal interface for ERC5192 Soulbound standard
interface IERC5192 {
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}

contract LoanLensCreditNFT is ERC721, IERC5192, Ownable {
    uint256 private _nextTokenId = 1; // Start from 1 so 0 represents "no token" in mapping
    
    mapping(uint256 => bool) private _locked;
    mapping(address => uint256) public walletToTokenId;
    mapping(uint256 => uint256) public tokenScore;
    
    constructor() ERC721("LoanLens Credit Passport", "LLCP") Ownable(msg.sender) {}

    function mint(address to, uint256 score) external onlyOwner {
        require(score >= 650, "Score too low for NFT");
        require(walletToTokenId[to] == 0, "Wallet already has an NFT");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        walletToTokenId[to] = tokenId;
        tokenScore[tokenId] = score;
        
        // Soulbound lock
        _locked[tokenId] = true;
        emit Locked(tokenId);
    }

    function updateScore(uint256 tokenId, uint256 newScore) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        tokenScore[tokenId] = newScore;
    }

    function locked(uint256 tokenId) external view override returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _locked[tokenId];
    }
    
    // Override transfers to block all movement (Soulbound)
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}
