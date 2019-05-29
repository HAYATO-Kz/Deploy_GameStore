$(document).ready(function(){
    var queryString = decodeURIComponent(window.location.search);
    var id = (queryString.split('='))[1];
  
    fetch(`http://localhost:3000/dlcs/findByDLCId/${id}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let authors = data.results; // Get the results
      var dlc = data.product[0];
      document.getElementById('dlcPrice').innerHTML = dlc.price +" baht";
      document.getElementById('dlcPicture').src = `http://localhost:3000/${dlc.productImage}`
      document.getElementById('dlcTitle').innerHTML = dlc.name;
      document.getElementById('releaseDate').innerHTML = dlc.releaseDate;
      document.getElementById('developer').innerHTML = "";
      document.getElementById('publisher').innerHTML = dlc.publisher;
      document.getElementById('category').innerHTML = "";
      document.getElementById('tOPlaying').innerHTML = '';
      document.getElementById('language').innerHTML = '';
  
      //input developer name
      for(var x in dlc.developer){
        var dev = dlc.developer[x];
        if(dev !== dlc.developer[0]){
          document.getElementById('developer').innerHTML+= ", "
        }
        document.getElementById('developer').innerHTML+= dev;
      }
  
      // input category
      for(var x in dlc.category){
        var cate = dlc.category[x];
        if(cate !== dlc.category[0]){
          document.getElementById('category').innerHTML+= ", "
        }
        document.getElementById('category').innerHTML+= cate;
      }
      
      // input type of playing
      for(var x in dlc.typeOfPlaying){
        var type = dlc.typeOfPlaying[x];
        if(type !== dlc.typeOfPlaying[0]){
          document.getElementById('tOPlaying').innerHTML+= ", "
        }
        document.getElementById('tOPlaying').innerHTML+= type;
      }
  
      // input language
      for(var x in dlc.language){
        var language = dlc.language[x];
        if(language !== dlc.language[0]){
          document.getElementById('language').innerHTML+= ", "
        }
        document.getElementById('language').innerHTML+= language;
      }
  
      // document.getElementById('dlcDescription').innerHTML = dlc.description
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
  