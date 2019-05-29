var user
var token
var userID


$(document).ready(function() {
    document.getElementById('userDropDown').style.display = "none"
});

function change() {
    $("#loginModal").modal('hide');
    $("#registerModal").modal('show');
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID;
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

function check() {
    var showGame = document.getElementById('showGame');
    showGame.innerHTML = '';
    showGame.innerHTML += '<div class = "box" style="background-color: black"></div>'
}

function search() {

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

function information() {

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