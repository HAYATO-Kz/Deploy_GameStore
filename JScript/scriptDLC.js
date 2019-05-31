var dID;
var token;
var sQuantity;
$(document).ready(function() {

    var queryString = decodeURIComponent(window.location.search);
    var text = (queryString.split('?'))[1];
    token = (text.split('@'))[1];
    dID = (((text.split('@'))[0]).split('='))[1];

    if (token == "undefined") {
      document.getElementById("signInButton").style.display = "block";
      document.getElementById("userDropDown").style.display = "none";
  } else {
      var base64Url = token.split(".")[1];
      var base64 = decodeURIComponent(
          atob(base64Url)
          .split("")
          .map(function(c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      user = JSON.parse(base64);
      userID = user.userId;

      $.ajax({
          url: "http://cd-game-store.herokuapp.com/users/details/" + userID,
          type: "GET",
          beforeSend: function(req) {
              req.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: function(res) {
              document.getElementById("userButton").innerHTML =
                  res.user[0].name.first_name;
          }
      });

      document.getElementById("signInButton").style.display = "none";
      document.getElementById("userDropDown").style.display = "block";
  }

    fetch(`http://cd-game-store.herokuapp.com/stocks/findById/${dID}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            sQuantity = (data.stock)[0].quantity;
            document.getElementById('stockQuantity').innerHTML = sQuantity;
        })

    fetch(`http://cd-game-store.herokuapp.com/dlcs/findByDLCId/${dID}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var dlc = data.dlc[0];
      document.getElementById('dlcPrice').innerHTML = dlc.price +" baht";
      document.getElementById('dlcPicture').src = `http://cd-game-store.herokuapp.com/${dlc.dlcImage}`
      document.getElementById('dlcTitle').innerHTML = dlc.name;
      document.getElementById('BuyModalTitleLabel').innerHTML = dlc.name;
      document.getElementById('releaseDate').innerHTML = dlc.releaseDate;
      document.getElementById('developer').innerHTML = "";
      document.getElementById('category').innerHTML = "";
      document.getElementById('tOPlaying').innerHTML = '';
      document.getElementById('language').innerHTML = '';
  
      var request = async() => {
        var response = await fetch(`http://cd-game-store.herokuapp.com/products/findByProductId/${dlc.productId}`);
        var data = await response.json();
        var product = (data.product)[0];

        document.getElementById('publisher').innerHTML = product.publisher;
        //input developer name
      for(var x in product.developer){
        var dev = product.developer[x];
        if(dev !== product.developer[0]){
          document.getElementById('developer').innerHTML+= ", "
        }
        document.getElementById('developer').innerHTML+= dev;
      }
  
      // input category
      for(var x in product.category){
        if(cate==="NA"){
          continue;
        }
        var cate = product.category[x];
        if(cate !== product.category[1]){
          document.getElementById('category').innerHTML+= ", "
        }
        document.getElementById('category').innerHTML+= cate;
      }
      
      // input type of playing
      for(var x in product.typeOfPlaying){
        var type = product.typeOfPlaying[x];
        if(type==="NA"){
          continue;
        }
        if(type !== product.typeOfPlaying[1]){
          document.getElementById('tOPlaying').innerHTML+= ", "
        }
        document.getElementById('tOPlaying').innerHTML+= type;
      }
  
      // input language
      for(var x in product.language){
        var language = product.language[x];
        if(language==="NA"){
          continue;
        }
        if(language !== product.language[1]){
          document.getElementById('language').innerHTML+= ", "
        }
        document.getElementById('language').innerHTML+= language;
      }
      }

      request();
  
      // document.getElementById('dlcDescription').innerHTML = dlc.description
      String.prototype.splice = function(idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
      };
      var description;
      if(dlc.description.length >= 50){
          description = (dlc.description).splice(50, 0, '<span id="more">');
          description = `<p>${description}</span><a href="#" onclick="show()" id="dots">...</a>`
      }else{
        description = dlc.description;
      }
      document.getElementById('dlcDescription').innerHTML = description
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

function backToIndex() {
    window.location.href = "index.html" + "?token=" + token;
}

function changeToCartPage() {
    window.location.href = "cart.html" + "?token=" + token;
}

function goCart() {
    var stockID;

    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    var userID = (JSON.parse(base64)).userId;
    var quantity = document.getElementById('inputQuantity').value;
    if (quantity > sQuantity) {
        alert("Out of stock");
        return
    }else if(quantity <= 0) {
      alert("Quantity can be less than 1")
      return;
    }
    $(`#buyModal`).modal('hide');
    fetch(`http://cd-game-store.herokuapp.com/stocks/findById/${dID}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            stockID = (data.stock)[0]._id;

            var data = {
                "stock": stockID,
                "user": userID,
                "quantity": quantity
            };

            var url = 'http://cd-game-store.herokuapp.com/carts/create';
            $.ajax({
                dataType: 'json',
                url: url,
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(data) {
                    changeToCartPage();
                }
            });
        })
}

function contShopping() {
    var stockID;

    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    var userID = (JSON.parse(base64)).userId;
    var quantity = document.getElementById('inputQuantity').value;
    if (quantity > sQuantity) {
        alert("Out of stock");
        return
      }else if(quantity <= 0) {
        alert("Quantity can be less than 1")
        return;
      }
    $(`#buyModal`).modal('hide');
    fetch(`http://cd-game-store.herokuapp.com/stocks/findById/${dID}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            stockID = (data.stock)[0]._id;

            var data = {
                "stock": stockID,
                "user": userID,
                "quantity": quantity
            };

            var url = 'http://cd-game-store.herokuapp.com/carts/create';
            $.ajax({
                dataType: 'json',
                url: url,
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(data) {
                    backToIndex();
                }
            });
        })
}

function reset() {
    document.getElementById('inputQuantity').value = "";
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID + "@" + token;
}

function chooseCart() {
    window.location.href = "cart.html" + "?token=" + token;
}

function logout() {
  window.location.href = "dlc.html" + "?id=" + dID + "@" + "undefined";
}

function change() {
  $("#loginModal").modal("hide");
  $("#registerModal").modal("show");
}

function signUp() {
  var firstName = $("#firstNameInput").val();
  var lastName = $("#lastNameInput").val();
  var age = $("#ageInput").val();
  var email = $("#emailInput").val();
  var password = $("#passwordInput").val();
  var address = $("#addressInput").val();

  if (
      firstName !== "" &&
      lastName !== "" &&
      age !== "" &&
      email !== "" &&
      password !== "" &&
      address !== ""
  ) {
      $("#registerModal").modal("hide");
      $("#loginModal").modal("show");
      document.getElementById("inputID").value = email;
      document.getElementById("inputPassword").value = password;

      var data = {
          name: {
              first_name: firstName,
              last_name: lastName
          },
          age: age,
          email: email,
          password: password,
          address: address
      };

      var url = "http://cd-game-store.herokuapp.com/users/signup";

      $.ajax({
          dataType: "json",
          url: url,
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json"
      });
  } else {
      alert("Please fill all field!!!");
  }
}

function login() {
  var email = $('#inputID').val();
  var password = $('#inputPassword').val();
  if (email === "" || password === "") {
      alert("Please fill all field");
      return 0;
  }
  var url = 'http://cd-game-store.herokuapp.com/users/login';

  var data = {
      email: email,
      password: password
  };

  $.ajax({
      dataType: "json",
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      async: !1,
      success: function(res) {
          token = res.token;
          var base64Url = token.split(".")[1];
          var base64 = decodeURIComponent(
              atob(base64Url)
              .split("")
              .map(function(c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
          updateUser(JSON.parse(base64));
      }
  })
  userID = user.userId;
  // Change sign in to user butoon
  $("#loginModal").modal("hide");
  document.getElementById("signInButton").style.display = "none";
  document.getElementById("userDropDown").style.display = "block";

  // Get User Json
  $.ajax({
      url: "http://cd-game-store.herokuapp.com/users/details/" + userID,
      type: "GET",
      beforeSend: function(req) {
          req.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function(res) {
          document.getElementById("userButton").innerHTML =
              res.user[0].name.first_name;
      }
  });
  window.location.href = "dlc.html" + "?id=" + dID + "@" + token;
}

function updateUser(json) {
  user = json;
}