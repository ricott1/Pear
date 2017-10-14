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
      return AgoraInstance.newAccount.sendTransaction({from:web3.eth.coinbase, gas: 980000});

    }).then(function (v){
      accountsData[user]["address"] = web3.eth.coinbase;
      console.log(accountsData);
      $('#actionsDiv').show().children().show();
      $('#createButton').hide();
      App.getRep();

    })
  },

  submitPaper: function(user){
    var paperKey;
    text = accountsData[user]["address"] + $('#ID').val();
    paperKey = SHA1(text);
    console.log(paperKey);
    App.contracts.Agora.deployed().then(function(instance){
  		AgoraInstance = instance;
  		stake = $("#stake").val();


    console.log(stake);
  		return AgoraInstance.submitPaper.call(0, stake, paperKey);
      
    }).then(function (value){
      //perform the real transaction
      console.log(stake, value);
      return AgoraInstance.submitPaper.sendTransaction(0, stake, paperKey,{from:web3.eth.coinbase, gas: 180000});

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
  	var usertable = document.getElementById('userTable');
    setInterval(function(){
  	  i = 1;
    //table.innerHTML = "";
    	for (var key in accountsData) {
        if(accountsData[key]["address"] != "") {
          if (i>=usertable.rows.length) {
            var row = usertable.insertRow(i);
            var name = row.insertCell(0);
            var rep = row.insertCell(1);
          } else{
            var row = usertable.rows[i];
            var name = row.cells[0];
            var rep = row.cells[1];
          }
  		
    		i++;
    		name.innerHTML = key;
    		App.getUserRep(key, 0, rep);        
        }
      }
      var paperstable = document.getElementById('papersTable');
      for (var j = 0; j < papersData.length; j++) {
        if (j + 1 >= paperstable.rows.length) {
            var row = paperstable.insertRow(j+1);
            var paperKeyCell = row.insertCell(0);
            var paperTime = row.insertCell(1);
          } else{
            var row = paperstable.rows[j+1];
            var paperKeyCell = row.cells[0];
            var paperTime = row.cells[1];
          }
          paperKeyCell.innerHTML = papersData[j];
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
