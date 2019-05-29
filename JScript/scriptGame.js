$(document).ready(function(){
  var queryString = decodeURIComponent(window.location.search);
  var id = (queryString.split('='))[1];

  fetch(`http://localhost:3000/products/findByProductId/${id}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var game = data.product[0];
    document.getElementById('gamePrice').innerHTML = game.price +" baht";
    document.getElementById('gamePicture').src = `http://localhost:3000/${game.productImage}`
    document.getElementById('gameTitle').innerHTML = game.name;
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

    // document.getElementById('gameDescription').innerHTML = game.description

    // for(var x in game.dlcId){
    //   fetch(`http://localhost:3000/dlcs/findByDLCId/${x}`)
    //   .then(function(res) {
    //     return res.json();
    //   })
    //   .then(function(dataDlc){
    //       document.getElementById('gameDLC').innerHTML += `<tr>
    //                                                         <td>Partner clother</td>
    //                                                         <td>250</td>
    //                                                       </tr>`;
    //   })
    // }

    // for(var x in game.achievementId){
    //   fetch(`http://localhost:3000/achievements/findByAchievementId/${x}`)
    //   .then(function(resp) {
    //     return resp.json();
    //   })
    //   .then(function(dataAch){
    //       document.getElementById('gameAchievement').innerHTML += `<tr>
    //                                                         <td>Partner clother</td>
    //                                                         <td>250</td>
    //                                                       </tr>`;
    //   })
    // }
  })
});

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
