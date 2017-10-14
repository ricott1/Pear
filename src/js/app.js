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

      var user = sessionStorage.loggedUser;
      App.createAccount(user);

    });
    $(document).on('click', '#submissionButton', function() {
      var user = sessionStorage.loggedUser;
      App.submitPaper(user);
    });

    $(document).on('click', '#reviewButton', function() {
      App.reviewPaper();
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
      console.log(localStorage);
      var accData = JSON.parse(localStorage.accountsData);
      console.log(accData);

      accData[user]["address"] = web3.eth.coinbase;
      localStorage.clear()
      localStorage.accountsData = JSON.stringify(accData);
      console.log(localStorage);

      $('#submitDiv').show().children().show();
      $('#createButton').hide();
      App.getRep();

    })
  },

  submitPaper: function(user){
    var paperKey;
    var accData = JSON.parse(localStorage.accountsData);
    text = accData[user]["address"] + $('#ID').val();

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

  reviewPaper: function(){
    App.contracts.Agora.deployed().then(function(instance){
  		AgoraInstace = instance;
  		stake = 2;
  		score = [$("#reviewQuality").val(), $("#reviewImpact").val(), $("#reviewNovelty").val()] ;
      paperKey = $("#reviewInput").val();
      reviewKey = SHA1(paperKey + "ale");
  		return AgoraInstance.submitReview.call(0, stake, paperKey, reviewKey, score);
      
      
    }).then(function (value){
      //perform the real transaction
      return AgoraInstance.submitReview.sendTransaction(0, stake, paperKey, reviewKey, score,{from:web3.eth.coinbase, gas: 300000});

    });
	  

	},


  getRep: function(){
  	var usertable = document.getElementById('userTable');
    setInterval(function(){
  	  i = 1;
    //table.innerHTML = "";
      var accData = JSON.parse(localStorage.accountsData);
      console.log(accData);
    	for (var key in accData) {
        if("address" in accData[key]) {
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
          var btn = document.createElement('input');
          btn.type = "button";
          btn.className = "btn";
          btn.value = papersData[j];
          //btn.onclick = (function() {return function() {
            //                                            $("#reviewDiv").show().children().show();
              //                                          $("#reviewInput").val(papersData[j]);
                //                                        }})();
          btn.onclick = function () {
                          $("#reviewDiv").show().children().show();
                          $("#reviewInput").text($(this).value);
                        }
          paperKeyCell.innerHTML = "";
          paperKeyCell.appendChild(btn);

          //paperKeyCell.innerHTML = papersData[j];
        App.getPaperTimestamp(papersData[j], paperTime);
      }
    }, 1000)

  },

  getUserRep: function(key, field, entry){
    var accData = JSON.parse(localStorage.accountsData);
    var addr = accData[key]['address'];
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      return AgoraInstance.getReputation.call(addr, field);
          }).then(function(rep) {
            accData[key]['reputation'] = rep;
            localStorage.accountsData = JSON.stringify(accData);
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
