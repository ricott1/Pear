pragma solidity ^0.4.15;

contract Pear 
{
    struct Account {
      mapping (address => uint) reputation;
      //uint[3] stake;
      bool hasAccount;
    }

    struct Review {
        address author;
        uint[3] score;
        uint stake;
        uint timestamp;
        bool exists;
    }

    struct Paper {
      address author;//looks bad here but one can not read it from the contract
      uint field;
      uint stake;
      address[] reviewKeys;
      uint timestamp;
      bool exists;
    }

    mapping (address => Account) public accounts;
    mapping (address => Paper) public papers;
    mapping (address => Review) public reviews;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 

    modifier hasAccount(address addr) {
        require(accounts[addr].hasAccount == true);
        _;
    }

    modifier hasNotAccount(address addr) {
        require(accounts[addr].hasAccount == false);
        _;
    }

    modifier beforeEndReview(uint ) {
        require(accounts[addr].hasAccount == false);
        _;
    }

    function Pear() {
        owner = msg.sender;
    }

    function newAccount() public hasNotAccount(msg.sender) returns(bool) {
        //require(!hasAccount(msg.sender)); 
        accounts[msg.sender].hasAccount = true;
        accounts[msg.sender].reputation[0] = 10;
        return true;
    }

    function deleteAccount(address addr) public onlyOwner hasAccount(addr) returns(bool) {
        //require(hasAccount(addr));
        accounts[addr].hasAccount = false;
        return true;
    }

    function exists(address addr) private constant returns(bool) {
        if(papers[addr].exists) return true;
        else return false;
    }

    function submitPaper(uint field, uint stake, address key) public hasAccount(msg.sender) returns(bool) {
        //require (hasAccount(msg.sender));   
        require (accounts[msg.sender].reputation[field] >= stake);
        require (newPaper(stake, field, key));    
        accounts[msg.sender].reputation[field] -= stake;
        //accounts[msg.sender].stake[field] += stake;
        return true;
    }

    function newPaper(uint stake, uint field, address key) internal returns(bool) {
        Paper memory paper;
        paper.field = field;
        paper.timestamp = now;
        paper.stake = stake;
        paper.exists = true;
        papers[key] = paper;
        return true;
    }

    function submitReview(uint field, uint stake, address paperKey, address reviewKey, uint[3] score) public hasAccount(msg.sender) returns(bool) {
        //require (hasAccount(msg.sender));
        require (exists(paperKey));
        require (accounts[msg.sender].reputation[field] > 0);
        require (accounts[msg.sender].reputation[field] >= stake);
        require (newReview(stake, paperKey, reviewKey, score));
        accounts[msg.sender].reputation[field] -= stake;
        //accounts[msg.sender].stake[field] += stake;
          
        return true;
    }

    function newReview(uint stake, address paperKey, address reviewKey, uint[3] score) internal returns(bool) {
        Review memory review;
        review.score = score;
        review.timestamp = now;
        review.stake = stake;
        review.exists = true;
        papers[paperKey].reviewKeys.push(reviewKey);
        reviews[reviewKey] = review;
        return true;
    }


    function getScore(address paperKey) public constant returns(uint[3]) {
        require (exists(paperKey));
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

    function getReputation(address addr, uint field) public constant hasAccount(addr) returns(uint) {
        //require (hasAccount(addr));
        return accounts[addr].reputation[field];
    }

    function getPaperTimestamp(address key) public constant returns(uint) {
        require (exists(key));
        return papers[key].timestamp;
    }

    function getPaperStake(address key) public constant returns(uint) {
        require (exists(key));
        return papers[key].stake;
    }

}

