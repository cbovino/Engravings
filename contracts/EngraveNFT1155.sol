// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EngraveNFT1155 is ERC1155 {
    using Counters for Counters.Counter;
    // unique relationship between group and account being issued
    Counters.Counter private _relationshipIds;
    Counters.Counter private _packIds;

    constructor()ERC1155("https://storage.googleapis.com/engrave-nfts/{id}.json") {
    }

    struct packProperties {
        string name_;
        address owner;
        uint _packId;
        bool active;
    }


    mapping(uint => packProperties) public packs;
    mapping(address => packProperties[]) public OwnerPackIds;
    mapping(address => mapping(uint256 => uint)) public Relationships;

    event NewPack(uint packId); 
    event NewRelationship(uint relationshipId, uint packId, address reciever);

    /**
     * Allows anyone to become an owner of a pack. 
     * A person can own multipe packs. 
     * Pack Ids are unique
     * Emits the newly created group id
     */
    function createPack(string memory name_) public {
        // start a group in storage, based on packId
        packProperties storage newPack = packs[_packIds.current()];
        //also save in map
        newPack._packId =  _packIds.current();
        // mark group as active
        newPack.active = true;  
        //assign group owner and name
        newPack.owner = msg.sender;
        newPack.name_ = name_;
        // store the storage in map
        packs[_packIds.current()] = newPack;
        // add to struct
        OwnerPackIds[msg.sender].push(newPack);
        _packIds.increment();

        // returns pack id, to be used for indexing the beginning
        emit NewPack(newPack._packId);
    }

    /**
     * Allows an owner to engrave a relationship with another address
     * 
     * Emits the id of the relationship
     */
    function engraveToPack(address to, uint packId) public {

        // assumes no one could have vitaliks acocunt?
        require(packs[packId].owner == msg.sender, "Must be an owner of the pack");
        // each token represents a relationship, with a unique id that represents the relationship
        uint256 newRelationship = _relationshipIds.current();

        // reciever address -> relationship Id ->  packId
        mapping(uint256 => uint) storage relToPack = Relationships[to];
        relToPack[newRelationship] = packId;
        _mint(to, newRelationship, 1, "");
        // save the token uri, along with a stamp
        // increment relationship id for next relationship
        _relationshipIds.increment();
        emit NewRelationship(newRelationship, packId, to);

    }

    /**
     * @dev See {IERC1155-safeTransferFrom}.
     * An engraver can end a relationship or transfer a relationship
     * from represents the group the token is from
     * to represents the address where the relationship will be sent to
     * id represents the _relationshipId
     * amount will always be 1, since its non fungible
     *
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        // retrieve packId from relationships
        uint retrievedPackId = Relationships[from][id];
        require(
            packs[retrievedPackId].owner == msg.sender, 
            "ERC1155: caller must be the group owner for pack of the relationship Id"
        );
         Relationships[to][id] = retrievedPackId;
         //remove person from the pack and add them to the zero list. fowl players
         Relationships[from][id] = 0;
        
        _safeTransferFrom(from, to, id, amount, data);
    }

    function getOwnerPackIds(address ownerAddress) public view returns (packProperties[] memory){
        return OwnerPackIds[ownerAddress];
    }
    
}   