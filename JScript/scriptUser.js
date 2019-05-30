var text
var token
var id

$(document).ready(function() {
    var queryString = decodeURIComponent(window.location.search);
    text = (queryString.split('?'))[1];
    token = (text.split('@'))[1];
    id = (((text.split('@'))[0]).split('='))[1];
    // Get User
    $.ajax({
            url: "http://localhost:3000/users/details/" + id,
            type: 'GET',
            beforeSend: function(req) {
                req.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function(data) {
                data = data.user[0];
                document.getElementById('nameLabel').innerHTML = `${data.name.first_name} ${data.name.last_name}`;
                document.getElementById('ageLabel').innerHTML = data.age;
                document.getElementById('emailLabel').innerHTML = data.email;
                document.getElementById('addressLabel').innerHTML = data.address;
                document.getElementById('pointLabel').innerHTML = data.point;
            }
        })
        // Get History
        var date;
        var quantity;
        var req = async() => {
        var res = await fetch(`http://localhost:3000/historys/findByUserId/${id}`,{
            headers: {
                'Authorization': 'Bearer ' + token,
                }
        })
        var hData = await res.json();
        hData = (hData.history)[0];
        console.log("History")
        console.log(hData);
        date = hData.date;
        quantity = hData.quantity;
        

}

req();
});

function initialData() {

    var el = document.getElementById('nameLabel');
    var text = (el.innerText || el.textContent);
    var arrayName = text.split(" ");
    document.getElementById('firstNameEdit').value = arrayName[0];
    document.getElementById('lastNameEdit').value = arrayName[1];

    el = document.getElementById('ageLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('ageEdit').value = text;

    el = document.getElementById('emailLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('emailEdit').value = text;

    el = document.getElementById('addressLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('addressEdit').value = text;
}

function editUser() {
    var firstNameEdit = document.getElementById('firstNameEdit').value
    var lastNameEdit = document.getElementById('lastNameEdit').value
    var ageEdit = document.getElementById('ageEdit').value
    var emailEdit = document.getElementById('emailEdit').value
    var addressEdit = document.getElementById('addressEdit').value

    var data = [{
        "propName": "name.first_name",
        "value": firstNameEdit
    }, {
        "propName": "name.last_name",
        "value": lastNameEdit
    }, {
        "propName": "age",
        "value": parseInt(ageEdit)
    }, {
        "propName": "email",
        "value": emailEdit
    }, {
        "propName": "address",
        "value": addressEdit
    }];

    // Update user 
    $.ajax({
        dataType: 'json',
        url: "http://localhost:3000/users/update/" + id,
        type: 'PATCH',
        data: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        success: function(res) {
            console.log("SUCCESS")
        }
    })

    // Refresh page
    document.location.reload(true);
}

function reset(BtnID) {
    document.getElementById(BtnID).value = "";
}