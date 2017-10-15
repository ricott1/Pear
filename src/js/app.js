App = {

  web3Provider: null,
  contracts: {},

  init: function() {
    App.getRep();
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
      App.createAccount(sessionStorage.user);

    });
    $(document).on('click', '#submissionButton', function() {
      App.submitPaper(sessionStorage.user);
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
      localStorage.setItem(web3.eth.coinbase, user);
      $('#submitDiv').show().children().show();
      $('#createButton').hide();
      //App.getRep();

    })
  },

  submitPaper: function(user){
    var paperKey;
    
    text = web3.eth.coinbase + $('#ID').val();

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
      localStorage.setItem(paperKey, "paper");
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

    }).then(function (v){
      localStorage.setItem(reviewKey, "review");
    })


	},


  getRep: function(){
    $("#tablesDiv").show().children().show();
  	
    setInterval(function(){
  	  i = 1;
      j = 1;
    var usertable = document.getElementById('userTable');
    var paperstable = document.getElementById('papersTable');
    	for (var key in localStorage) {
        if(localStorage.getItem(key) == "paper") {
          if (j >= paperstable.rows.length) {
            var row = paperstable.insertRow(j);
            var paperKeyCell = row.insertCell(0);
            var paperTime = row.insertCell(1);
          } else{
            var row = paperstable.rows[j];
            var paperKeyCell = row.cells[0];
            var paperTime = row.cells[1];
          }
          var btn = document.createElement('input');
          btn.type = "button";
          btn.value = key;
          //btn.onclick = (function() {return function() {
            //                                            $("#reviewDiv").show().children().show();
              //                                          $("#reviewInput").val(papersData[j]);
                //                                        }})();
          btn.onclick = function () {
                          $("#reviewDiv").show().children().show();
                          console.log($("#reviewInput"));
                          $("#reviewInput").val(($(this).val()));
                        }
          paperKeyCell.innerHTML = "";
          paperKeyCell.appendChild(btn);

          j ++;
          App.getPaperTimestamp(key, paperTime);
        } else if(localStorage.getItem(key) != "review"){
          //console.log(localStorage.getItem(key), key);
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
      		name.innerHTML = localStorage.getItem(key);
          if(localStorage.getItem(key) == sessionStorage.user) {
            name.style.color = 'red';
          }
		else {name.style.color= 'black';}
      		App.getUserRep(key, 0, rep);        
        }
      }
      
    }, 1000)

  },

  getUserRep: function(key, field, entry){
    App.contracts.Agora.deployed().then(function(instance){
      AgoraInstance = instance;
      return AgoraInstance.getReputation.call(key, field);
          }).then(function(rep) {
            //console.log(rep.c[0], key);
            entry.innerHTML = rep.c[0];
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
    for (var key in localStorage) {
      if(sessionStorage.user == localStorage.getItem(key)) {
        $("#createButton").hide();
        $('#submitDiv').show().children().show();
        $('#createButton').hide();
        
        break;
      }
    }
    App.init();
  });
});
