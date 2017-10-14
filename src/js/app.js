App = {

  web3Provider: null,
  contracts: {},
  card1: 0,
  card2: 0,

  init: function() {
    
    return App.initWeb3();
  },

  initWeb3: function() {

    if (typeof web3 != 'undefined') {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } else {
    //set provider
    App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {

    $.getJSON('Agora.json', function(data){

      // get contract artifacts
      var AgoraArtifact = data;
      App.contracts.Agora= TruffleContract(AgoraArtifact);  

      //set provider
      App.contracts.Agora.setProvider(App.web3Provider);  
    })

    return App.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click', '#submit', function() {
        App.submitPaper($(this));
    });

    $(document).on('click', '#review', function() {
        App.reviewPaper($(this));
    });
  
  },

  submitPaper: function(stake, id){

  },

  reviewPaper: function(stake, id, score){

	     },

  sit: function(button) {
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      //first thest if the call is succesful
      return AgoraInstance.newPlayer.call();
      
    }).then(function (value){
      //perform the real transaction
      return AgoraInstance.newPlayer.sendTransaction({from:web3.eth.coinbase,
        gas: 180000});
      
    }).then(function (value){
      button.prop('disabled',true);
      button.hide();
      $('#total').show();
      return AgoraInstance.getCards();

      }).then(function(cards) {
        $('.cardButton').show();
        $('#card3').prop('disabled',false);
        var card1 = cards[0]%13;
        var card2 = cards[1]%13;       
        $('#card1').css('background', 'url(images/' + card1 + '.png)');
        $('#card2').css('background', 'url(images/' + card2 + '.png)');
        return AgoraInstance.getTotal(cards);
      }).then(function(total) {
        console.log(total);
        $('#total').html(total.c[0]);
      }, function(reason) {
      console.log(reason);
    })

  },
  addExtraCard: function(button) {
    
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      return AgoraInstance.addExtraCard.call();
      
    }).then(function (value){
      return AgoraInstance.addExtraCard.sendTransaction({from:web3.eth.coinbase,
        gas: 700000});
      
    }).then(function (value){
        button.prop('disabled',true);
        return AgoraInstance.getCards();
      }).then(function(cards) {
        var card3 = cards[2]%13;
        button.css('background', 'url(images/' + card3 + '.png)');
        return AgoraInstance.getTotal(cards);
      }).then(function(total) {
        console.log(total);
        $('#total').html(total.c[0]);
    }, function(reason) {
      console.log(reason);
    }) ;
    /*
    return AgoraInstance.getCard.call();
    }).then(function (value){
        var card = AgoraInstance.getCard.call();
        console.log(value);
        console.log(card);
        $('#address').html(value.c[0]);
        $('#card1').css('background', 'url(images/10-of-hearts.png)');
    }, function(reason) {
      console.log(reason);
    })    */
  },



};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
