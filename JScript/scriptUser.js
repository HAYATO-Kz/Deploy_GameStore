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
                document.getElementById("userButton").innerHTML = data.name.first_name;
            }
        })
        // Get History
    var date;
    var quantity;
    var title;
    var totalPrice;
    var req = async() => {
        var res = await fetch(`http://localhost:3000/historys/findByUserId/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        var hData = await res.json();
        hData = hData.history;
        for (var x in hData) {
            var history = hData[x];
            date = history.date;
            quantity = history.quantity;
            var itemId = history.item;

            var itemResponse = await fetch(`http://localhost:3000/stocks/findByStockId/${itemId}`)
            var sData = await itemResponse.json();
            var stock = (sData.stock)[0];
            var url;
            if(stock.type === "DLC"){
                url = `http://localhost:3000/dlcs/findByDLCId/${stock.itemId}`
            } else {
                url = `http://localhost:3000/products/findByProductId/${stock.itemId}`
            }
            var response2 = await fetch(url);
            var iData = await response2.json();
            if (stock.type === "DLC") {
                item = (iData.dlc)[0];
            } else {
                item = (iData.product)[0];
            }
            title = item.name;
            totalPrice = quantity * item.price;
            document.getElementById('showHistory').innerHTML += `<tr>
                                                                    <td>${date.day}/${date.month}/${date.year}</td>
                                                                    <td>${title}</td>
                                                                    <td>${quantity}</td>
                                                                    <td>${totalPrice}</td>
                                                                </tr>`
        }
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
        }
    })

    // Refresh page
    document.location.reload(true);
}

function reset(BtnID) {
    document.getElementById(BtnID).value = "";
}

function backToIndex() {
    window.location.href = "index.html" + "?token=" + token;
}

function chooseCart() {
    window.location.href = "cart.html" + "?token=" + token;
}

function logout() {
    window.location.href = "index.html";
}