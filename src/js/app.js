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
    
    $(document).on('click', '#createButton', function() {
      var user = localStorage.getItem("loggedUser");
        App.createAccount(user);

    });
    $(document).on('click', '#submissionButton', function() {
      var user = localStorage.getItem("loggedUser");
            App.submitPaper(user);
        });

        $(document).on('click', '#reviewButton', function() {
            App.reviewPaper($(this));
        });
  //App.createAccount();
  },

  createAccount : function(user) {
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      
      //first test if the call is succesful
      return AgoraInstance.newAccount.call();
      
    }).then(function (value){
      //perform the real transaction
      return AgoraInstance.newAccount.sendTransaction({from:web3.eth.coinbase, gas: 180000});

    }).then(function (v){
      accountsData[user]["address"] = web3.eth.coinbase;
      console.log(accountsData);
      $('#submissionButton').show();
        $('#reviewButton').show();
        $('#createButton').hide();
        App.getRep();

    })
  },

  submitPaper: function(user){
    var paperKey;
    //var username = $("#username").value;
    //var accountAddress = accountsData[username];


    text = accountsData[user]["address"] + $('#ID').val();
    paperKey = SHA1(text);
    console.log(paperKey);
    App.contracts.Agora.deployed().then(function(instance){
  		AgoraInstance = instance;
  		stake = $("#stake").val();



  		return AgoraInstance.submitPaper.call(0, stake, paperKey);
      
    }).then(function (value){
      //perform the real transaction
      return AgoraInstance.submitPaper.sendTransaction(0, stake, paperKey,{from:web3.eth.coinbase, gas: 1800000});

    }).then(function (v){
      papersData.push(paperKey);
      console.log(papersData);
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
  	var table = document.getElementById('reptable');
    setInterval(function(){
  	  i = 1;
    //table.innerHTML = "";
    	for (var key in accountsData) {
        if(accountsData[key]["address"] != "") {
          if (i>=table.rows.length) {
            var row = table.insertRow(i);
            var name = row.insertCell(0);
            var rep = row.insertCell(1);
            var paperTime = row.insertCell(2);
          } else{
            var row = table.rows[i];
            var name = row.cells[0];
            var rep = row.cells[1];
            var paperTime = row.cells[2];
          }
  		
    		i++;
    		name.innerHTML = key;
    		App.getUserRep(key, 0, rep);
        
        
        }
      }
      for (var j = papersData.length - 1; j >= 0; j--) {
        App.getPaperTimestamp(papersData[j], paperTime);
      }
    }, 1000)

  },

  getUserRep: function(key, field, entry){
    var addr = accountsData[key]['address'];
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      return AgoraInstance.getReputation.call(addr, field);
          }).then(function(rep) {
            accountsData[key]['reputation'] = rep;
            entry.innerHTML = rep;

          })

  },

  getPaperTimestamp: function(key, entry){
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      return AgoraInstance.getPaperTimestamp.call(key);
          }).then(function(timestamp) {
            entry.innerHTML = timestamp;

          })

  },




};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
