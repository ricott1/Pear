App = {

  web3Provider: null,
  contracts: {},

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
    $(document).on('click', '#submissionButton', function() {
        App.submitPaper($(this));
    });

    $(document).on('click', '#reviewButton', function() {
        App.reviewPaper($(this));
    });
    $(document).on('click', '#loginButton', function() {
        App.createAccount();
    });
  //App.createAccount();
  },

  createAccount : function() {
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      
      //first test if the call is succesful
      return AgoraInstance.newAccount.call();
      
    }).then(function (value){
      //perform the real transaction
      return AgoraInstance.newAccount.sendTransaction({from:web3.eth.coinbase, gas: 180000});

    }).then(function (v){
      accountsData[loggedUser]["address"] = web3.eth.coinbase;
      console.log(accountsData);

    })
  },

  submitPaper: function(button){
    var paperKey;
    //var username = $("#username").value;
    //var accountAddress = accountsData[username];
    text = accountsData[loggedUser]["address"] + $('#ID').val;
    paperKey = SHA1(text);
    console.log(paperKey);
    App.contracts.Agora.deployed().then(function(instance){
  		AgoraInstance = instance;
  		id = $("#ID").val;
  		stake = $("#stake").val;

  		return AgoraInstance.submitPaper.call();
      
    }).then(function (value){
      //perform the real transaction
      return AgoraInstance.submitPaper.sendTransaction(id, stake, {from:web3.eth.coinbase, gas: 180000});

    })
  },
/*
  reviewPaper: function(button){
    App.contracts.Agora.deployed().then(function(instance){
  		AgoraInstace = instance;
  		id = $("#ID").val;
  		stake = $("#stake").val;
  		score = $("#score").val;

  		return AgoraInstance.submitReview(id, stake, score, {from:web3.eth.coinbase, gas:180000});
	  });

	},

//get the rep of all users
*/
  getRep: function(){
  	setInterval(function(){
  	for (var key in accountsData) {
      if(accountsData[key]["address"] != "") {
        rep = getUserRep(accountsData[key]["address"], 0);
      }
    }
  	}, 5000)

  },

  getUserRep: function(address, field){
    
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      return AgoraInstance.getReputation.call(address, field);
          })

  },




};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
