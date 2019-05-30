var userId
var cartId

$(document).ready(function() {
    var queryString = decodeURIComponent(window.location.search);
    // text = queryString.split("?")[1];
    // productId = text.split("@")[1];
    // cartId = text.split("@")[0].split("=")[1];

    fetch("http://localhost:3000/cart/" + userId)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });
});

function deleteRow(docID) {
    $.ajax({
        url: "http://localhost:3000/carts/delete/" + cartId,
        type: 'DELETE',
        success: function(res) {
            docID.closest("tr").remove();
        }
    })


}

function deleteAll() {
    //ยังไม่ได้ สร้าง
    $.ajax({
        url: "http://localhost:3000/carts/deleteAll/" + userId,
        type: 'DELETE',
        success: function(res) {
            console.log("DELETE ALL CART")
        }
    })
}

function endBuyProcess() {
    $("#cartTable")
        .find("tr:gt(0)")
        .remove();
    $("#paymentChoose").collapse("hide");
    $("#addressChoose").collapse("hide");
}

function useOld() {
    document.getElementById("inputNewAddress").disabled = true;
}

function useNew() {
    document.getElementById("inputNewAddress").disabled = false;
}

function edit() {
    var quantity = document.getElementById('newQuantityInput').value;

    var data = {
        propName: "quantity",
        value: parseInt(quantity)
    };

    $.ajax({
        dataType: "json",
        url: "http://localhost:3000/carts/update/" + cartId,
        type: "PATCH",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        success: function(res) {
            document.getElementById('quantityId').innerHTML = quantity;
        }
    });
}