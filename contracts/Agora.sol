pragma solidity ^0.4.4;

contract Agora 
{
    struct Account {
      uint[3] reputation;
      uint[3] stake;
      bool hasAccount;
    }

    struct Review {
        address author;
        uint[3] score;
        uint timestamp;
        bool exists;
    }

    struct Paper {
      address author;//looks bad here but one can not read it from the contract
      uint field;
      //uint reputation;
      address[] reviewKeys;
      uint timestamp;
      bool exists;
    }

    mapping (address => Account) accounts;
    mapping (address => Paper) papers;
    mapping (address => Review) reviews;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 

    function Agora() {
        owner = msg.sender;
    }
 
    function checkAccount() public constant returns(bool) {
        return hasAccount(msg.sender);
    }

    function newAccount() public returns(bool) {
        require(!hasAccount(msg.sender)); 
        accounts[msg.sender].hasAccount = true;
        accounts[msg.sender].reputation = [10,10,10];
        return true;
    }

    function deleteAccount(address addr) public onlyOwner returns(bool) {
        require(hasAccount(addr));
        accounts[addr].hasAccount = false;
        return true;
    }

    function hasAccount(address addr) private constant returns(bool) {
        return accounts[addr].hasAccount;
    }

    function submitPaper(uint field, uint stake, address key) public returns(bool) {
        require (hasAccount(msg.sender));   
        require (accounts[msg.sender].reputation[field] >= stake);
        require (newPaper(msg.sender, field, key));    
        accounts[msg.sender].reputation[field] -= stake;
        accounts[msg.sender].stake[field] += stake;
        return true;
    }

    function newPaper(address addr, uint field, address key) private returns(bool) {
        Paper paper;
        paper.author = addr;
        paper.field = field;
        paper.timestamp = now;
        //paper.reputation = 0;
        paper.exists = true;
        papers[key] = paper;
        return true;
    }

    function submitReview(uint field, uint stake, address paperKey, address reviewKey, uint[3] score) public returns(bool) {
        require (hasAccount(msg.sender));
        require (papers[paperKey].exists);
        require (accounts[msg.sender].reputation[field] > 0);
        require (accounts[msg.sender].reputation[field] >= stake);
        require (newReview(msg.sender, paperKey, reviewKey, score));
        accounts[msg.sender].reputation[field] -= stake;
        accounts[msg.sender].stake[field] += stake;
          
        return true;
    }

    function newReview(address reviewerAddr, address paperKey, address k, uint[3] score) private returns(bool) {
        Review memory review;
        review.author = reviewerAddr;
        review.score = score;
        review.timestamp = now;
        review.exists = true;
        papers[paperKey].reviewKeys.push(k);
        reviews[k] = review;
        return true;
    }

    function getScore(address paperKey) public constant returns(uint[3]) {
        require(papers[paperKey].exists);
        uint[3] memory score;
        uint N = papers[paperKey].reviewKeys.length;
        for (uint i = 0; i < N; i++) {
            address revKey = papers[paperKey].reviewKeys[i];
            for (uint j = 0; j < 3; j++) {
                score[j] += reviews[revKey].score[j]/N;
            }
        }
        return score;
    }

    function getReputation(address addr, uint field) public constant returns(uint) {
        require (hasAccount(addr));
        return accounts[addr].reputation[field];
    }

    function getPaperTimestamp(address key) public constant returns(uint) {
        require (papers[key].exists);
        return papers[key].timestamp;
    }

}

