var userID;
var token;
var dataCart;
var dataHistory = [];

$(document).ready(function() {
    var pQuantity;
    var productTitle;
    var totalPrice;
    var cartID;
    var queryString = decodeURIComponent(window.location.search);
    token = (queryString.split('='))[1];

    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    userID = (JSON.parse(base64)).userId;

    if (typeof token == undefined) {
        document.getElementById("signInButton").style.display = "block";
        document.getElementById("userDropDown").style.display = "none";
    } else {
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

    const request = async() => {
        const response1 = await fetch(`http://localhost:3000/carts/${userID}`);
        const data1 = await response1.json();
        dataCart = data1.carts;
        for (var x in dataCart) {
            var list = dataCart[x];
            pQuantity = list.quantity;
            cartID = list._id;
            var response2 = await fetch(`http://localhost:3000/stocks/findByStockId/${list.stock}`);
            var data2 = await response2.json();
            var stock = (data2.stock)[0];
            url = `http://localhost:3000/products/findByProductId/${stock.itemId}`
            if (stock.type === "DLC") {
                url = `http://localhost:3000/dlcs/findByDLCId/${stock.itemId}`
            }
            var response3 = await fetch(url);
            var data3 = await response3.json();
            var product;
            if (stock.type === "DLC") {
                product = (data3.dlc)[0];
            } else {
                product = (data3.product)[0];
            }
            var cID = cartID;
            productTitle = product.name;
            totalPrice = (product.price) * pQuantity;
            var ins = [stock.itemId, pQuantity, list.stock, stock.quantity];
            dataHistory.push(ins);
            document.getElementById('cartBody').innerHTML +=
                `<tr class="d-flex">
                    <td class="col-md-4">${productTitle}</td>
                    <td class="col-md-3" id = "${cartID}Quantity">${pQuantity}</td>
                    <td class="col-md-3">${totalPrice}</td>
                    <td class="col-md-2">
                        <div class="row">
                            <div class="col-md-10">
                                <button type="button" class="btn btn-secondary btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    EDIT
                                </button>
                                <div class="dropdown-menu">
                                    <div class="form-group container">
                                        <label for="newQuantityInput${cID}">New Quantity</label>
                                        <input type="number" id="newQuantityInput${cID}" class="form-control mb-3">
                                        <button class="btn btn-secondary btn-block" onclick="edit('${cID}','${stock.quantity}')">EDIT</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                 <button type="button" class="close" aria-label="Close" onclick="deleteRow('${cID}',this)">
                                     <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </td>
                 </tr>`
        }
    }
    request();
});

function deleteRow(cID, docID) {
    $.ajax({
        url: `http://localhost:3000/carts/delete/${cID}`,
        type: 'DELETE',
        success: function(res) {
            docID.closest("tr").remove();
        }
    })


}

function endBuyProcess() {

    for (var x in dataHistory) {
        var his = dataHistory[x];
        var quantity = his[1];
        var stockId = his[2];
        var sQuantity = his[3];
        var newQuantity = sQuantity - quantity;
        var d = new Date().toISOString().split("T")[0];
        var dd = d.split("-");
        var date = { "year": dd[0], "month": dd[1], "day": dd[2] };



        var data = {
            "userId": userID,
            "item": stockId,
            "quantity": quantity,
            "date": date
        };
        var url = `http://localhost:3000/historys/create`
        $.ajax({
            dataType: 'json',
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            async: 1,
        })

        var data2 = [{
            "propName": "quantity",
            "value": parseInt(newQuantity)
        }];
        $.ajax({
            dataType: "json",
            url: `http://localhost:3000/stocks/update/${stockId}`,
            type: "PATCH",
            data: JSON.stringify(data2),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    $.ajax({
        url: "http://localhost:3000/carts/deleteAll/" + userID,
        type: 'DELETE',
        success: function() {
            window.location.reload();
        }
    })
}

function useOld() {
    document.getElementById("inputNewAddress").disabled = true;
}

function useNew() {
    document.getElementById("inputNewAddress").disabled = false;
}

function edit(id,sQuantity) {
    var quantity = document.getElementById(`newQuantityInput${id}`).value;
    if(quantity <= 0) {
        alert("Quantity can be less than 1")
        return;
    }else if(quantity > sQuantity){
        alert("out of stock");
        return
    }
    var data = [{
        "propName": "quantity",
        "value": parseInt(quantity)
    }];
    $.ajax({
        dataType: "json",
        url: `http://localhost:3000/carts/update/${id}`,
        type: "PATCH",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        success: function(res) {
            window.location.reload();
        }
    });
}

function backToIndex() {
    window.location.href = "index.html" + "?token=" + token;
}

function chooseUser() {
    window.location.href = "user.html" + "?id=" + userID + "@" + token;
}

function logout() {
    window.location.href = "index.html";
}