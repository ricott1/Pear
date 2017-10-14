pragma solidity ^0.4.4;

contract Agora 
{
    struct Account {
      uint[3] reputation;
      uint[3] stake;
      bool hasAccount;
    }

    struct Paper {
      address author;
      uint field;
      uint[3] score;
      uint timestamp;
    }

    mapping (address => Account) accounts;
    mapping (address => Paper) papers;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 

    function Agora() {
        owner = msg.sender;
    }
 
    function newAccount() public returns(bool) {
        //require(!hasAccount(msg.sender)); gonna use require after Metropolis
        if (hasAccount(msg.sender)) return false;
        accounts[msg.sender].hasAccount = true;
        accounts[msg.sender].reputation = [0,0,0];
        return true;
    }

    function deleteAccount(address addr) public onlyOwner returns(bool) {
        //require(hasAccount(addr));
        if (!hasAccount(addr)) return false;
        accounts[addr].hasAccount = false;
        return true;
    }

    function hasAccount(address addr) private constant returns(bool) {
        return accounts[addr].hasAccount;
    }

    function submitPaper(uint field, uint stake, address key) public returns(bool) {
        if (!hasAccount(msg.sender)) return false;
        if (accounts[msg.sender].reputation[field] < stake) return false;
        accounts[msg.sender].lastSubmission = now;
        accounts[msg.sender].reputation[field] -= stake;
        accounts[msg.sender].stake[field] += stake;
        return true;
    }

    function newPaper(address a, uint f) private returns(bool) {
        if (!hasAccount(a)) return false;
        Paper paper;
        paper[author] = a;
        paper[field] = f;
        paper[score] = [0,0,0];
        paper[timestamp] = now;
        return true;
    }

    function submitReview(uint field, uint stake) public returns(bool) {
        if (!hasAccount(msg.sender)) return false;
        if (accounts[msg.sender].reputation[field] < stake) return false;
        accounts[msg.sender].lastSubmission = now;
        accounts[msg.sender].reputation[field] -= stake;
        accounts[msg.sender].stake[field] += stake;
        return true;
    }

    function getReputation(address addr, uint field) public constant returns(uint) {
        if (!hasAccount(addr)) return 0;
        return accounts[addr].reputation[field];
    }

    function uintToBytes(uint v) constant returns (bytes32 ret) {
        if (v == 0) {
            ret = '0';
        }
        else {
            while (v > 0) {
                ret = bytes32(uint(ret) / (2 ** 8));
                ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
                v /= 10;
            }
        }
        return ret;
    }

    function addressToBytes(address addr) constant returns (bytes b){
       assembly {
            let m := mload(0x40)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, addr))
            mstore(0x40, add(m, 52))
            b := m
       }
    }

}

