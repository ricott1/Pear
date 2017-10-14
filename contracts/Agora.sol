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
      address author;
      uint field;
      Review[3] reviews;
      uint numReviews;
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
        accounts[msg.sender].reputation[field] -= stake;
        accounts[msg.sender].stake[field] += stake;
        if (!newPaper(msg.sender, field, key)) return false;
        return true;
    }

    function newPaper(address addr, uint f, address k) private returns(bool) {
        if (!hasAccount(addr)) return false;
        Paper paper;
        paper.author = addr;
        paper.field = f;
        paper.timestamp = now;
        paper.exists = true;
        paper.numReviews = 0;
        papers[k] = paper;
        return true;
    }

    function submitReview(uint field, uint stake, address paperKey, address reviewKey, uint[3] score) public returns(bool) {
        if (!papers[paperKey].exists) return false;
        if (!hasAccount(msg.sender)) return false;
        if (accounts[msg.sender].reputation[field] <= 0) return false;
        if (accounts[msg.sender].reputation[field] < stake) return false;
        accounts[msg.sender].reputation[field] -= stake;
        accounts[msg.sender].stake[field] += stake;
        if (!newReview(msg.sender, paperKey, reviewKey, score)) return false;
          
        return true;
    }

    function newReview(address reviewerAddr, address paperKey, address k, uint[3] score) private returns(bool) {
        if (!hasAccount(reviewerAddr)) return false;
        Review memory review;
        review.author = reviewerAddr;
        review.score = score;
        review.timestamp = now;
        review.exists = true;
        if (papers[paperKey].numReviews >= 3) return false;
        papers[paperKey].reviews[papers[paperKey].numReviews] = review; 
        papers[paperKey].numReviews += 1;
        reviews[k] = review;
        return true;
    }

    function getScore(address paperKey) public constant returns(uint[3]) {
        //uint[3] memory invalid;
        //invalid = [0, 0, 0];
        //if (!papers[paperKey].exists) return invalid;
        //if (papers[paperKey].numReviews <= 0) return invalid;
        require(papers[paperKey].exists);
        require(papers[paperKey].numReviews > 0);
        uint[3] memory score;
        for (uint i = 0; i < papers[paperKey].numReviews; i++) {
            for (uint j = 0; j < 3; j++) {
                score[j] += papers[paperKey].reviews[i].score[j]/papers[paperKey].numReviews;
            }
        }
        return score;
    }

    function getReputation(address addr, uint field) public constant returns(uint) {
        if (!hasAccount(addr)) return 0;
        return accounts[addr].reputation[field];
    }

    function getPaperAuthor(address key) private constant returns(address) {
        //if (!papers[key].exists) return 0;
        return papers[key].author;
    }

}

