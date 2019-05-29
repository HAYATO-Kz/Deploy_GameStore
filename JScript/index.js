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

    var url = 'http://localhost:3000/user/signup';

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

    var url = 'http://localhost:3000/user/login';

    var data = {
        "email": email,
        "password": password
    };

    $.ajax({
        dataType: 'json',
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
    });

    $("#loginModal").modal('hide');


}