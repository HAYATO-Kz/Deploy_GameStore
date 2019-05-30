var product;
var user;
var token;
var userID;

$(document).ready(function () {
    document.getElementById('userDropDown').style.display = "none"
    var showGame = document.getElementById('showGame');
    showGame.innerHTML = '';
    fetch("http://localhost:3000/products")
    .then(function(response) {
        return response.json();
      })
    .then(function(data) {
        let authors = data.results; // Get the results
        product = data.products;
        for(var x in product){
            var game = product[x];
            console.log(typeof game._id);
            showGame.innerHTML += `<div class="card" style="width: 325px;margin:10px;" onclick="chooseGame('${game._id}')">
                                        <img class="card-img-top" src="http://localhost:3000/${game.productImage}" alt="Card image cap">
                                        <div class="card-body">
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                    `
        }
    })
});

function change() {
    $("#loginModal").modal('hide');
    $("#registerModal").modal('show');
}

function chooseGame(id){
    window.location.href = "game.html" +"?id="+ id;
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID + "@" + token; 
}

function search(){
    var title = document.getElementById('searchTitle').value;

    fetch(`http://localhost:3000/products/findByName/${title}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        chooseGame(data._id);
    })
}

function signUp() {
    var firstName = $('#firstNameInput').val();
    var lastName = $('#lastNameInput').val();
    var age = $('#ageInput').val();
    var email = $('#emailInput').val();
    var password = $('#passwordInput').val();
    var address = $('#addressInput').val();

    var data = {
        "name": {
            "first_name": firstName,
            "last_name": lastName
        },
        "age": age,
        "email": email,
        "password": password,
        "address": address
    };

    var url = 'http://localhost:3000/users/signup';

    $.ajax({
        dataType: 'json',
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
    });

    $("#registerModal").modal('hide');

}

function login() {
    var email = $('#inputID').val();
    var password = $('#inputPassword').val();

    var url = 'http://localhost:3000/users/login';

    var data = {
        "email": email,
        "password": password
    };

    $.ajax({
        dataType: 'json',
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        async: !1,
        success: function(res) {
            token = res.token;
            var base64Url = token.split('.')[1];
            var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            updateUser(JSON.parse(base64));
        }
    })
    userID = user.userId;

    // Change sign in to user butoon
    $("#loginModal").modal('hide');
    document.getElementById('signInButton').style.display = "none"
    document.getElementById('userDropDown').style.display = "block"

    // Get User Json
    $.ajax({
        url: "http://localhost:3000/users/" + userID,
        type: 'GET',
        beforeSend: function(req) {
            req.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function(res) {
            document.getElementById('userButton').innerHTML = res.user[0].name.first_name;
        }
    })


}

function logout() {
    user = null;
    token = null;
    document.getElementById('signInButton').style.display = "block"
    document.getElementById('userDropDown').style.display = "none"
}

function updateUser(json) {
    user = json;
}