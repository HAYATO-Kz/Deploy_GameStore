var product;
var user;
var token;
var userID;
var category = [];
var playstyle = [];
var language = [];
var price = [0, 10000000];
var rProduct;

$(document).ready(function() {
    var queryString = decodeURIComponent(window.location.search);
    if (queryString.includes('token=')) {
        token = (queryString.split('='))[1];
    }else{
        window.location.href = "index.html?token=undefined";
    }

    if (token === 'undefined') {
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

    fetch("http://cd-game-store.herokuapp.com/products/")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            product = data.products;
            ranRun(product);
        });
});

function ranRun(product){
    rProduct = [];
            var usedNumber = [];
            var min=0; 
            var max=product.length - 1; 
            for(var i = 0 ; i < 9; i++){
                var random = Math.random() * (+max - +min) + +min;
                random = parseInt(random);
                if(usedNumber.includes(random)){
                    i--;
                    continue;
                }else{
                    usedNumber.push(random)
                }
                rProduct.push(product[random]);
            } 
            reRun(rProduct);
}

function reRun(products) {
    var showGame = document.getElementById("showGame");
    showGame.innerHTML = "";
    for (var x in products) {
        var game = products[x];
        showGame.innerHTML += `<div class="card" style="width: 325px;margin:10px; border: 2px solid black" onclick="chooseGame('${game._id}','${game.ageRate}')">   
                                <img class="card-img-top" src="http://cd-game-store.herokuapp.com/${
                                  game.productImage
                                }" alt="Card image cap">
                                <div class="card-body text-center">
                                    ${game.name}
                                </div>
                            </div>
                            `;
    }
}

function change() {
    $("#loginModal").modal("hide");
    $("#registerModal").modal("show");
}

function chooseGame(id,rate) {
    var age ;
    if(token==="undefined"){
        $('#inputAge').modal('show');
        document.getElementById('dateBtn').value = rate+"-"+id;
        return;
    }
    fetch(`http://cd-game-store.herokuapp.com/users/details/${userID}`,{
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then(function(res){return res.json();})
        .then(function(uData){
            // var uData = await response.json();
            var user =(uData.user)[0];
            age = user.age;
            checkAgeRate(age,rate,id);
        })
}

function setAge(btn) {
    var buttonT = (btn.value).split('-');
    var rate = buttonT[0];
    var id = buttonT[1];
    var date = document.getElementById('dateInput').value;
    date = date.split('-');
    var age = calculate_age(new Date(date[0],date[1],date[2]))
    checkAgeRate(age,rate,id);
}

function checkAgeRate(age,rate,id){
    if(age < rate){
        alert("THIS GAME MAY CONTAIN CONTENT NOT APPROPRIATE FOR ALL AGES");
    }else{
        window.location.href = "game.html" + "?id=" + id + "@" + token;
    }
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID + "@" + token;
}

function chooseCart() {
    window.location.href = "cart.html" + "?token=" + token;
}

function calculate_age(dob) { 
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function search() {
    var title = document.getElementById("searchTitle").value;

    fetch(`http://cd-game-store.herokuapp.com/products/findByName/${title}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var id = data.product[0]._id;
            var rate = (data.product)[0].ageRate;
            chooseGame(id,rate);
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
        category.push('"' + labelValue + '"');
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
        playstyle.push('"' + labelValue + '"');
    } else {
        var index = playstyle.indexOf(labelValue);
        playstyle.splice(index, 1);
    }
    getWFilter();
 }
 
 function languageWfilter(checkBox) {
    var labelValue = checkBox.value;
    var checkBoxStatus = checkBox.checked;
    if (checkBoxStatus) {
        language.push('"' + labelValue + '"');
    } else {
        var index = language.indexOf(labelValue);
        language.splice(index, 1);
    }
    getWFilter();
 }

 function getWFilter() {
    if (category.length == 0) {
        category = '"NA"';
    }
    if (playstyle.length == 0) {
        playstyle = '"NA"';
    }
    if (language.length == 0) {
        language = '"NA"';
    }
    var nCategory = `${category}`;
    var nLanguage = `${language}`;
    var nPlaystyle = `${playstyle}`
    var productWF = `{"price":[${price}],"category":[${nCategory}],"typeOfPlaying":[${nPlaystyle}],"language":[${nLanguage}]}`;
 
    var url = "http://cd-game-store.herokuapp.com/products/findByFilter/" + productWF;
    if (category == '"NA"' && playstyle == '"NA"' && language == '"NA"') {
        url = "http://cd-game-store.herokuapp.com/products/";
    }
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if(url === "http://cd-game-store.herokuapp.com/products/" ){
                data = data.products;
                ranRun(data);
            }else{
            product = data.product;
            reRun(product);
            }
        });

        if (category == '"NA"') {
            category = [];
        }
        if (playstyle == '"NA"') {
            playstyle = [];
        }
        if (language == '"NA"') {
            language = [];
        }
    }       