var user

$(document).ready(function() {
    document.getElementById('signOutButton').style.display = "none"
    document.getElementById('userName').style.display = "none"
});

function change() {
    $("#loginModal").modal('hide');
    $("#registerModal").modal('show');
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

    var x = ajax(url, data);
    console.log(x);
    $("#loginModal").modal('hide');
    document.getElementById('signInButton').style.display = "none"
    document.getElementById('signOutButton').style.display = "block"
    document.getElementById('userName').style.display = "block"
}

function getUser(json) {
    user = json;
    //console.log(user);
}

function ajax(url, data) {
    $.ajax({
        dataType: 'json',
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
            var base64Url = res.token.split('.')[1];
            var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(base64);
            //console.log(user);
        }
    })
}