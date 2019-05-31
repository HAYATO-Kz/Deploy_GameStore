var pID;
var sQuantity;
var user;
var token;
var userID;
$(document).ready(function() {
    var queryString = decodeURIComponent(window.location.search);
    text = queryString.split("?")[1];
    pID = text.split("@")[0].split("=")[1];
    token = text.split("@")[1];
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

    fetch(`http://cd-game-store.herokuapp.com/stocks/findById/${pID}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            sQuantity = data.stock[0].quantity;
            document.getElementById("stockQuantity").innerHTML = sQuantity;
        });

    fetch(`http://cd-game-store.herokuapp.com/products/findByProductId/${pID}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var game = data.product[0];
            document.getElementById("gamePrice").innerHTML = game.price + " baht";
            document.getElementById("gamePicture").src = `http://cd-game-store.herokuapp.com/${
        game.productImage
      }`;
            document.getElementById("gameTitle").innerHTML = game.name;
            document.getElementById("BuyModalTitleLabel").innerHTML = game.name;
            document.getElementById("releaseDate").innerHTML = game.releaseDate;
            document.getElementById("developer").innerHTML = "";
            document.getElementById("publisher").innerHTML = game.publisher;
            document.getElementById("category").innerHTML = "";
            document.getElementById("tOPlaying").innerHTML = "";
            document.getElementById("language").innerHTML = "";
            document.getElementById("gameDLC").innerHTML = "";
            document.getElementById("gameAchievement").innerHTML = "";

            //input developer name
            for (var x in game.developer) {
                var dev = game.developer[x];
                if (dev !== game.developer[0]) {
                    document.getElementById("developer").innerHTML += ", ";
                }
                document.getElementById("developer").innerHTML += dev;
            }

            // input category
            for (var x in game.category) {
                var cate = game.category[x];
                if(cate==="NA"){
                  continue;
                }
                if (cate !== game.category[1]) {
                    document.getElementById("category").innerHTML += ", ";
                }
                document.getElementById("category").innerHTML += cate;
            }

            // input type of playing
            for (var x in game.typeOfPlaying) {
                var type = game.typeOfPlaying[x];
                if(type==="NA"){
                  continue;
                }
                if (type !== game.typeOfPlaying[1]) {
                    document.getElementById("tOPlaying").innerHTML += ", ";
                }
                document.getElementById("tOPlaying").innerHTML += type;
            }

            // input language
            for (var x in game.language) {
                var language = game.language[x];
                if(language==="NA"){
                  continue;
                }
                if (language !== game.language[1]) {
                    document.getElementById("language").innerHTML += ", ";
                }
                document.getElementById("language").innerHTML += language;
            }

            String.prototype.splice = function(idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };
            var description;
            if (game.description.length >= 50) {
                description = game.description.splice(50, 0, '<span id="more">');
                description = `<p>${description}</span><a href="#" onclick="show()" id="dots">...</a>`;
            } else {
                description = game.description;
            }
            document.getElementById("gameDescription").innerHTML = description;

            for (var x in game.dlcId) {
                var id = game.dlcId[x];
                fetch(`http://cd-game-store.herokuapp.com/dlcs/findByDLCId/${id}`)
                    .then(function(res) {
                        return res.json();
                    })
                    .then(function(dataDlc) {
                        var dlc = dataDlc.dlc[0];
                        if (dlc.length === 0) {
                            return;
                        }
                        document.getElementById(
                            "gameDLC"
                        ).innerHTML += `<tr onclick="chooseDLC('${dlc._id}')">
                                                            <td>${dlc.name}</td>
                                                            <td>${
                                                              dlc.price
                                                            }</td>
                                                          </tr>`;
                    });
            }

    for(var x in game.achievementId){
      // console.log(game.achievementId);
      var id = (game.achievementId)[x];
      console.log(id);
      fetch(`http://cd-game-store.herokuapp.com/achievements/findByAchievementId/${id}`)
      .then(function(resp) {
        return resp.json();
      })
      .then(function(dataAch){
        // console.log(dataAch);
          var ach = (dataAch.achievement)[0];
          if(ach.length===0){
            return;
          }
          document.getElementById('gameAchievement').innerHTML += `<tr>
                                                            <td>${ach.name}</td>
                                                            <td>${
                                                              ach.description
                                                            }</td>
                                                          </tr>`;
                    });
            }
        });
});

function chooseDLC(id) {
    window.location.href = "DLC.html" + "?id=" + id + "@" + token;
}

function backToIndex() {
    window.location.href = "index.html" + "?token=" + token;
}

function changeToCartPage() {
    window.location.href = "cart.html" + "?token=" + token;
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
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
    $("#dlcCollapse").collapse("hide");
    $("#achievementCollapse").collapse("show");
}

function showDLC() {
    $("#achievementCollapse").collapse("hide");
    $("#dlcCollapse").collapse("show");
}

function goCart() {
    var stockID;

    if(token === "undefined"){
      $('#buyModal').modal('hide');
      $('#loginModal').modal('show');
      return;
    }

    var base64Url = token.split(".")[1];
    var base64 = decodeURIComponent(
        atob(base64Url)
        .split("")
        .map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    var userID = JSON.parse(base64).userId;
    var quantity = document.getElementById("inputQuantity").value;
    if (quantity > sQuantity) {
        alert("Out of stock");
        return;
      }else if(quantity <= 0) {
        alert("Quantity can be less than 1")
        return;
      }
    $(`#buyModal`).modal("hide");
    fetch(`http://cd-game-store.herokuapp.com/stocks/findById/${pID}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            stockID = data.stock[0]._id;

            var data = {
                stock: stockID,
                user: userID,
                quantity: quantity
            };

            var url = "http://cd-game-store.herokuapp.com/carts/create";
            $.ajax({
                dataType: "json",
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    changeToCartPage();
                }
            });
        });
}

function contShopping() {
    var stockID;

    if(token === "undefined"){
      $('#buyModal').modal('hide');
      $('#loginModal').modal('show');
      return;
    }

    var base64Url = token.split(".")[1];
    var base64 = decodeURIComponent(
        atob(base64Url)
        .split("")
        .map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    var userID = JSON.parse(base64).userId;
    var quantity = document.getElementById("inputQuantity").value;

    if (quantity > sQuantity) {
        alert("Out of stock");
        return;
      }else if(quantity <= 0) {
        alert("Quantity can be less than 1")
        return;
      }
    $(`#buyModal`).modal("hide");
    fetch(`http://cd-game-store.herokuapp.com/stocks/findById/${pID}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            stockID = data.stock[0]._id;

            var data = {
                stock: stockID,
                user: userID,
                quantity: quantity
            };

            var url = "http://cd-game-store.herokuapp.com/carts/create";
            $.ajax({
                dataType: "json",
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    backToIndex();
                }
            });
        });
}

function reset() {
    document.getElementById("inputQuantity").value = "";
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID + "@" + token;
}

function chooseCart() {
    window.location.href = "cart.html" + "?token=" + token;
}

function logout() {
  window.location.href = "game.html" + "?id=" + pID + "@" + "undefined";
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
  window.location.href = "game.html" + "?id=" + pID + "@" + token;
}

function updateUser(json) {
  user = json;
}