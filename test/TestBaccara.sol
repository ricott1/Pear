pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Baccara.sol";

contract TestBaccara {
  Baccara baccara = Baccara(DeployedAddresses.Baccara());

    function testCanCreateNewPlayer() {
      bool success = baccara.newPlayer();
      Assert.equal(success, true, "New player created");
    }
    
    function testCanAddCard() {
      bool successCard = baccara.addCard();
      Assert.equal(successCard, true, "New card added");
    }

    function testCanGetCards() {
      baccara.addCard();
      baccara.addCard();
      uint[3] memory cards = baccara.getCards();
      uint nCards = 0;
      for (uint i =0; i < cards.length; i++) {
        if (cards[i] != 0) {
            nCards++;
        }
      }
      Assert.equal(nCards, 3, "Player has 3 cards");
    }

    function testCanGetTotal() {
      uint[3] memory myCards;
      //uint[3] memory cards = baccara.getCards();
      myCards[0] = 8;
      myCards[1] = 15;
      myCards[2] = 11;
      uint total = baccara.getTotal(myCards);
      Assert.equal(total, 8, "Total is 8");
    }
}
