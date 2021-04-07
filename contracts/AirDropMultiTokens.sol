// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract AirDropMultiTokens is ERC1155 {
    uint256 public constant GOLDCOIN = 0;
    uint256 public constant STICKER = 1;
    uint256 public constant THORS_HAMMER = 2;

    // Mapping from token ID to account token claim status
    mapping (uint256 => mapping(address => bool)) claimStatus;

    mapping (uint256 => mapping(address => uint256)) private _balances;


    constructor () ERC1155("itemsDescription/{id}.json") {
        _mint(msg.sender, GOLDCOIN, 10**27, "");
        _mint(msg.sender, STICKER, 10**9, "");
        _mint(msg.sender, THORS_HAMMER, 1, "");
      
    }

    function leafHash(address leaf) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(uint8(0x00), leaf));
    }

    function nodeHash(bytes32 left, bytes32 right) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(uint8(0x01), left, right));
    }

    function verifyAddress(uint256 path, bytes32[] memory witnesses, address _account, bytes32 eligibleAddressMerkleRoot) public pure {
        
        bytes32 node = leafHash(_account);

        for (uint16 i = 0; i < witnesses.length; i++) {
            if ((path & 0x01) == 1) {
                node = nodeHash(witnesses[i], node);
            } else {
                node = nodeHash(node, witnesses[i]);
            }
            path /= 2;
        }
        require(node == eligibleAddressMerkleRoot, "Not eligible to claim Items");

        
    }

    function mintMoreItem(address account, uint256 _id, uint256 _amount, bytes memory _data) public {
        require (balanceOf(account,_id )== 0, "Token still available");
        _mint(account, _id, _amount, _data);

    }

    function mintMoreBatchItems(uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data) public {
        _mintBatch(msg.sender, _ids, _amounts, _data);
    }

    function claimTokenItem(address _to, uint256 _id, uint256 _amount, bytes memory _data, uint256 _path, bytes32[] memory _witnesses, bytes32 merkleRoot) public {

        require(claimStatus[_id][_to] == false && balanceOf(msg.sender, _id) > 0 , "You have claim this token before / there is no more token to claim");
        require(_to != msg.sender);

        // verify that address can claim token
        verifyAddress( _path, _witnesses, _to, merkleRoot);

        // set the claim status for the tokenID to true
        claimStatus[_id][_to] = true; 

        safeTransferFrom(msg.sender, _to, _id, _amount, _data);
     
    }

    function claimBatchTokenItem (address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data, uint256 _path, bytes32[] memory _witnesses, bytes32 merkleRoot) public {

        require(_to != msg.sender);

        // verify that address can claim token
        verifyAddress( _path, _witnesses, _to, merkleRoot);

        // set the claim status for the tokenID to true
        for (uint256 i = 0; i < _ids.length; ++i) {
            uint256 _id = _ids[i];
            require(claimStatus[_id][_to] == false && balanceOf(msg.sender, _id) > 0, "You have claim this token before / one of the tokens is not available for claim");
            claimStatus[_id][_to] = true;
        }
        safeBatchTransferFrom(msg.sender, _to, _ids, _amounts, _data);

    }
    
}