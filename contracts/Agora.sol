pragma solidity ^0.4.4;

contract Agora 
{
    struct Account {
      uint[3] reputation = [0,0,0];
      string email;
      bool hasAccount = false;
    }

    mapping (address => Account) accounts;
        
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 

    function Agora() {
        deck = shuffle(deck);
        owner = msg.sender;
    }

 
    function newAccount() public returns(bool) {
        //require(!hasAccount(msg.sender)); gonna use require after Metropolis
        if (hasAccount(msg.sender)) return false;
        accounts[msg.sender].hasAccount = true;
        return true;
    }

    function deleteAccount(address addr) public onlyOwner returns(bool) {
        //require(hasAccount(addr));
        if (!hasAccount(addr)) return false;
        accounts[addr].hasAccount = false;
        return true;
    }

    function hasAccount(address addr) private constant returns(bool isIndeed) {
        return accounts[addr].hasAccount;
    }


}

