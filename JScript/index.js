var product;
var user;
var token;
var userID;
var category = [];
var playstyle = [];
var language = [];
var price = [0, 10000000];

$(document).ready(function() {
    var queryString = decodeURIComponent(window.location.search);
    if (queryString.includes('token=')) {
        token = (queryString.split('='))[1];
    }

    if (typeof token === 'undefined') {
        document.getElementById("signInButton").style.display = "block";
        document.getElementById("userDropDown").style.display = "none";
    } else {
        token = queryString.split("=")[1];
        var base64Url = token.split(".")[1];
        var base64 = decodeURIComponent(
            atob(base64Url)
            .split("")
            .map(function(c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        userID = JSON.parse(base64).userId;
        $.ajax({
            url: "http://localhost:3000/users/details/" + userID,
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

    console.log(token);
    fetch("http://localhost:3000/products")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            product = data.products;
            reRun(product);
        });
});

function reRun(products) {
    var showGame = document.getElementById("showGame");
    showGame.innerHTML = "";
    for (var x in products) {
        var game = products[x];
        showGame.innerHTML += `<div class="card" style="width: 325px;margin:10px;" onclick="chooseGame('${
      game._id
    }')">
                                <img class="card-img-top" src="http://localhost:3000/${
                                  game.productImage
                                }" alt="Card image cap">
                                <div class="card-body">
                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                </div>
                            </div>
                            `;
    }
}

function change() {
    $("#loginModal").modal("hide");
    $("#registerModal").modal("show");
}

function chooseGame(id) {
    window.location.href = "game.html" + "?id=" + id + "@" + token;
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID + "@" + token;
}

function chooseCart() {
    window.location.href = "cart.html" + "?token=" + token;
}

function search() {
    var title = document.getElementById("searchTitle").value;

    fetch(`http://localhost:3000/products/findByName/${title}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var id = data.product[0]._id;
            chooseGame(id);
        });
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

        var url = "http://localhost:3000/users/signup";

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
    var url = 'http://localhost:3000/users/login';

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
        url: "http://localhost:3000/users/details/" + userID,
        type: "GET",
        beforeSend: function(req) {
            req.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(res) {
            document.getElementById("userButton").innerHTML =
                res.user[0].name.first_name;
        }
    });
    window.location.href = "index.html" + "?token=" + token;
}

function logout() {
    user = null;
    token = null;
    document.getElementById("signInButton").style.display = "block";
    document.getElementById("userDropDown").style.display = "none";
    window.location.href = "index.html";
}

function updateUser(json) {
    user = json;
}

function categoryWfilter(checkBox) {
    var labelValue = checkBox.value;
    var checkBoxStatus = checkBox.checked;
    if (checkBoxStatus) {
        category.push(labelValue);
    } else {
        var index = category.indexOf(labelValue);
        category.splice(index, 1);
    }
    getWFilter();
}

function playstyleWfilter(checkBox) {
    var labelValue = checkBox.value;
    var checkBoxStatus = checkBox.checked;
    if (checkBoxStatus) {
        playstyle.push(labelValue);
    } else {
        var index = playstyle.indexOf(labelValue);
        playstyle.splice(index, 1);
    }
    getWFilter();
}

function langaugeWfilter(checkBox) {
    var labelValue = checkBox.value;
    var checkBoxStatus = checkBox.checked;
    if (checkBoxStatus) {
        langauge.push(labelValue);
    } else {
        var index = langauge.indexOf(labelValue);
        language.splice(index, 1);
    }
    getWFilter();
}

function getWFilter() {
    if (category.length == 0) {
        category = 'NA';
    }
    if (playstyle.length == 0) {
        playstyle = 'NA';
    }
    if (language.length == 0) {
        language = 'NA';
    }
    var nCategory = `${category}`;
    // if (category.length >= 2) {
    //     categry = '[' + nCategory + ']';
    // }
    // var date = { "year": dd[0], "month": dd[1], "day": dd[2] };
    // var productWF = `{"price":[${price}],"catagory":${nCategory},"typeOfPlaying":${playstyle},"language":${language}}`;
    var productWF = {
        "price":price,
        "category":category,
        "typeOfPlaying":playstyle,
        "langauge":language
    }

    var json = JSON.stringify(productWF);

    var url = `http://localhost:3000/products/findByFilter/${json}`;
    if (category == 'NA' && playstyle == 'NA' && language == 'NA') {
        url = "http://localhost:3000/products";
    }
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            product = data.products;
            reRun(product);
        });

    if (category == 'NA') {
        category = [];
    }
    if (playstyle == 'NA') {
        playstyle = [];
    }
    if (language == 'NA') {
        language = [];
    }
}