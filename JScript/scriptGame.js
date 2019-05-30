var pID;
var token;
var sQuantity;
$(document).ready(function(){
  var queryString = decodeURIComponent(window.location.search);
  text = (queryString.split('?'))[1];
  token = (text.split('@'))[1];
  pID = (((text.split('@'))[0]).split('='))[1];

  fetch(`http://localhost:3000/stocks/findById/${pID}`)
  .then(function(res){
    return res.json();
  })
  .then(function(data){
    sQuantity = (data.stock)[0].quantity;
    document.getElementById('stockQuantity').innerHTML = sQuantity;
  })

  fetch(`http://localhost:3000/products/findByProductId/${pID}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var game = data.product[0];
    document.getElementById('gamePrice').innerHTML = game.price +" baht";
    document.getElementById('gamePicture').src = `http://localhost:3000/${game.productImage}`
    document.getElementById('gameTitle').innerHTML = game.name;
    document.getElementById('BuyModalTitleLabel').innerHTML = game.name;
    document.getElementById('releaseDate').innerHTML = game.releaseDate;
    document.getElementById('developer').innerHTML = "";
    document.getElementById('publisher').innerHTML = game.publisher;
    document.getElementById('category').innerHTML = "";
    document.getElementById('tOPlaying').innerHTML = '';
    document.getElementById('language').innerHTML = '';
    document.getElementById('gameDLC').innerHTML ="";
    document.getElementById('gameAchievement').innerHTML="";

    //input developer name
    for(var x in game.developer){
      var dev = game.developer[x];
      if(dev !== game.developer[0]){
        document.getElementById('developer').innerHTML+= ", "
      }
      document.getElementById('developer').innerHTML+= dev;
    }

    // input category
    for(var x in game.category){
      var cate = game.category[x];
      if(cate !== game.category[0]){
        document.getElementById('category').innerHTML+= ", "
      }
      document.getElementById('category').innerHTML+= cate;
    }
    
    // input type of playing
    for(var x in game.typeOfPlaying){
      var type = game.typeOfPlaying[x];
      if(type !== game.typeOfPlaying[0]){
        document.getElementById('tOPlaying').innerHTML+= ", "
      }
      document.getElementById('tOPlaying').innerHTML+= type;
    }

    // input language
    for(var x in game.language){
      var language = game.language[x];
      if(language !== game.language[0]){
        document.getElementById('language').innerHTML+= ", "
      }
      document.getElementById('language').innerHTML+= language;
    }

    String.prototype.splice = function(idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    var description;
    if(game.description.length >= 50){
        description = (game.description).splice(50, 0, '<span id="more">');
        description = `<p>${description}</span><a href="#" onclick="show()" id="dots">...</a>`
    }else{
      description = game.description;
    }
    document.getElementById('gameDescription').innerHTML = description

    for(var x in game.dlcId){
      var id = (game.dlcId)[x];
      fetch(`http://localhost:3000/dlcs/findByDLCId/${id}`)
      .then(function(res) {
        return res.json();
      })
      .then(function(dataDlc){
          var dlc = dataDlc.dlc[0];
          if(dlc.length===0){
            return;
          }
          document.getElementById('gameDLC').innerHTML += `<tr onclick="chooseDLC('${dlc._id}')">
                                                            <td>${dlc.name}</td>
                                                            <td>${dlc.price}</td>
                                                          </tr>`;
      })
    }

    for(var x in game.achievementId){
      var id = (game.achievementId)[x];
      fetch(`http://localhost:3000/achievements/findByAchievementId/${id}`)
      .then(function(resp) {
        return resp.json();
      })
      .then(function(dataAch){
          var ach = dataAch.achievement;
          if(ach.length===0){
            return;
          }
          document.getElementById('gameAchievement').innerHTML += `<tr>
                                                            <td>${ach.name}</td>
                                                            <td>${ach.description}</td>
                                                          </tr>`;
      })
    }
  })
});

function chooseDLC(id){
  window.location.href = "DLC.html" + "?id=" + id + "@" + token;
}

function backToIndex(){
  window.location.href = "index.html" + "?token="+ token;
}

function changeToCartPage(){
  window.location.href = "cart.html" + "?token=" +  token;
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

  function show() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var link = dots.innerHTML;
    if (link === "...") {
        dots.innerHTML = "Show less";
        moreText.style.display = "inline";
    } else {
        dots.innerHTML = "...";
        moreText.style.display = "none";
    }
  }

function showAchievement() {
    $('#dlcCollapse').collapse('hide');
    $('#achievementCollapse').collapse('show');
}

function showDLC() {
    $('#achievementCollapse').collapse('hide');
    $('#dlcCollapse').collapse('show');
}

function goCart(){
  var stockID;

  var base64Url = token.split('.')[1];
  var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  var userID = (JSON.parse(base64)).userId;
  var quantity = document.getElementById('inputQuantity').value;
  if(quantity > sQuantity){
    alert("Out of stock");
    return
  }
  $(`#buyModal`).modal('hide');
  fetch(`http://localhost:3000/stocks/findById/${pID}`)
  .then(function(res){
    return res.json();
  })
  .then(function(data){
    stockID = (data.stock)[0]._id;

    var data = {
      "stock": stockID,
      "user": userID,
      "quantity": quantity 
  };

  var url = 'http://localhost:3000/carts/create';
  $.ajax({
      dataType: 'json',
      url: url,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data){
        changeToCartPage();
      }
  });
  })
}

function contShopping(){
  var stockID;

  var base64Url = token.split('.')[1];
  var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  var userID = (JSON.parse(base64)).userId;
  var quantity = document.getElementById('inputQuantity').value;

  if(quantity > sQuantity){
    alert("Out of stock");
    return
  }
  $(`#buyModal`).modal('hide');
  fetch(`http://localhost:3000/stocks/findById/${pID}`)
  .then(function(res){
    return res.json();
  })
  .then(function(data){
    stockID = (data.stock)[0]._id;

    var data = {
      "stock": stockID,
      "user": userID,
      "quantity": quantity 
  };

  var url = 'http://localhost:3000/carts/create';
  $.ajax({
      dataType: 'json',
      url: url,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data){
        backToIndex();
      }
  });
  })
}

function reset(){
  document.getElementById('inputQuantity').value= "";
}
